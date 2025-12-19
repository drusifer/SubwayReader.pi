import React, { useState, useEffect, useCallback } from 'react';
import { Settings, RefreshCw, BookOpen, WifiOff, Wifi, AlertCircle, RotateCcw, Loader2 } from 'lucide-react';
import { Article, AppView, SyncStatus, AppSettings, UserProfile } from './types';
import { FALLBACK_ARTICLES, DEFAULT_SETTINGS } from './constants';
import * as storageService from './services/storageService';
import * as proxyService from './services/proxyService';
import * as geminiService from './services/geminiService';
import * as authService from './services/authService';
import ArticleCard from './components/ArticleCard';
import ReaderView from './components/ReaderView';
import SettingsModal from './components/SettingsModal';

export default function App() {
  // State
  const [view, setView] = useState<AppView>('feed');
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);

  // Load Settings on Mount
  useEffect(() => {
    const loadedSettings = storageService.loadSettings();
    if (loadedSettings) setSettings(loadedSettings);
    
    // Check for existing session
    const storedUser = localStorage.getItem('subway_user');
    if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch(e) { console.error(e); }
    }
  }, []);

  // Initialize Google Auth
  useEffect(() => {
     // Use environment variable for Client ID
     const clientId = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER';
     
     authService.initializeGoogleAuth(clientId, (response) => {
         const profile = authService.decodeJwt(response.credential);
         if (profile) {
             setUser(profile);
             localStorage.setItem('subway_user', JSON.stringify(profile));
         }
     });
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('subway_user');
  };

  // Save settings effect
  useEffect(() => {
    storageService.saveSettings(settings);
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Load Feed Function
  const loadFeed = useCallback(async () => {
    setIsLoadingFeed(true);
    setErrorMsg(null);
    try {
      // 1. Load stored articles (offline cache)
      const storedArticles = storageService.loadArticles();

      // 2. Fetch new headlines from Gemini
      let newHeadlines: Article[] = [];
      try {
        // Pass settings AND user to fetchHeadlines to use User Interests & Identity
        newHeadlines = await geminiService.fetchHeadlines(settings, user);
      } catch (e) {
        console.warn("Failed to fetch Gemini headlines, using fallback.", e);
        if (storedArticles.length === 0) {
            newHeadlines = FALLBACK_ARTICLES;
        } else {
            setErrorMsg("Could not fetch new headlines. Showing cached articles.");
        }
      }

      // 3. Merge Strategies
      const mergedArticles = newHeadlines.map(headline => {
        const existing = storedArticles.find(s => s.url === headline.url);
        if (existing) {
            return { ...headline, ...existing, isDownloaded: true, syncError: existing.syncError };
        }
        return headline;
      });

      const storedOnly = storedArticles.filter(
        stored => !newHeadlines.some(h => h.url === stored.url)
      );

      setArticles([...mergedArticles, ...storedOnly]);

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load feed.");
    } finally {
      setIsLoadingFeed(false);
    }
  }, [settings, user]); 

  // Initial Load
  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Sync Logic
  const handleSync = useCallback(async () => {
    if (syncStatus === 'syncing') return;
    
    setSyncStatus('syncing');
    setErrorMsg(null);
    
    const articlesToSync = articles.filter(a => !a.isDownloaded);
    setSyncProgress({ current: 0, total: articlesToSync.length });

    if (articlesToSync.length === 0) {
      setSyncStatus('idle');
      return;
    }

    const newArticles = [...articles];

    try {
      for (let i = 0; i < articlesToSync.length; i++) {
        const article = articlesToSync[i];
        
        // 1. Fetch Content (Using Gemini Proxy now, no serverUrl needed)
        try {
            const contentData = await proxyService.fetchArticle(
                article.url, 
                "", // No longer using server URL
                settings.simulatedMode
            );
            
            // 2. Generate Summary if missing
            let summary = article.summary;
            if (!summary) {
               try {
                   summary = await geminiService.generateSummary(contentData.content);
               } catch (geminiError) {
                   console.error("Gemini summary failed:", geminiError);
                   summary = "Summary unavailable.";
               }
            }

            // 3. Update Article Object (Success)
            const updatedArticle: Article = {
                ...article,
                content: contentData.content,
                title: contentData.title || article.title, 
                summary: summary,
                isDownloaded: true,
                syncError: false, // Reset error on success
                cachedAt: new Date().toISOString()
            };

            const index = newArticles.findIndex(a => a.url === updatedArticle.url);
            if (index !== -1) newArticles[index] = updatedArticle;
            
            setArticles([...newArticles]);
            storageService.saveArticles(newArticles);

        } catch (err) {
            console.error(`Failed to sync article ${article.title}:`, err);
            
            // 3b. Update Article Object (Failure)
            const failedArticle: Article = {
                ...article,
                isDownloaded: false,
                syncError: true 
            };
            
            const index = newArticles.findIndex(a => a.url === failedArticle.url);
            if (index !== -1) newArticles[index] = failedArticle;
            setArticles([...newArticles]);
        }

        setSyncProgress(prev => ({ ...prev, current: i + 1 }));
      }
    } catch (e) {
        setErrorMsg("Sync batch process encountered an issue.");
        console.error(e);
    } finally {
        setSyncStatus('idle');
    }

  }, [articles, settings, syncStatus]);

  // Navigation Handlers
  const openArticle = (id: string) => {
    setCurrentArticleId(id);
    setView('reader');
  };

  const closeReader = () => {
    setView('feed');
    setCurrentArticleId(null);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Views
  const currentArticle = articles.find(a => a.id === currentArticleId);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col transition-colors duration-200">
      
      {/* Header (Only visible in Feed) */}
      {view === 'feed' && (
        <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Subway Reader
            </h1>
            <div className="flex items-center gap-2">
               {/* Manual Refresh Button */}
               <button 
                 onClick={loadFeed} 
                 disabled={isLoadingFeed}
                 className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                 title="Refresh Headlines"
               >
                 <RotateCcw className={`w-4 h-4 ${isLoadingFeed ? 'animate-spin' : ''}`} />
               </button>

               {settings.simulatedMode ? (
                   <span data-testid="mode-badge" className="text-xs font-mono bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded">SIMULATED</span>
               ) : (
                   <span data-testid="mode-badge" className="text-xs font-mono bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded">LIVE (AI)</span>
               )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-4 pb-24">
        {view === 'feed' && (
          <div className="space-y-4">
            
            {errorMsg && (
                <div data-testid="error-message" className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200 p-3 rounded-lg flex items-center gap-2 text-sm mb-4">
                    <AlertCircle className="w-4 h-4" />
                    {errorMsg}
                </div>
            )}
            
            {user && !isLoadingFeed && articles.length > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 px-1">
                    News curated for <strong>{user.name}</strong>
                </div>
            )}

            {isLoadingFeed && articles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p>Curating headlines with Gemini...</p>
                </div>
            ) : (
                articles.map(article => (
                <ArticleCard 
                    key={article.id} 
                    article={article} 
                    onClick={() => openArticle(article.id)} 
                />
                ))
            )}
            
            {!isLoadingFeed && articles.length === 0 && !errorMsg && (
                 <div className="text-center py-20 text-gray-400">
                    <p>No articles found.</p>
                    <button onClick={loadFeed} className="text-indigo-500 underline mt-2">Try refreshing</button>
                 </div>
            )}
          </div>
        )}

        {view === 'reader' && currentArticle && (
          <ReaderView 
            article={currentArticle} 
            onBack={closeReader}
            fontSize={settings.fontSize}
            fontFamily={settings.fontFamily}
          />
        )}
      </main>

      {/* Thumb Zone / Bottom Bar (Sticky) */}
      {view === 'feed' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 pb-8 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="max-w-3xl mx-auto flex justify-between items-center px-4">
                <button 
                    onClick={toggleSettings}
                    data-testid="settings-button"
                    className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 relative"
                    aria-label="Settings"
                >
                    {user ? (
                        <img src={user.picture} alt="Profile" className="w-6 h-6 rounded-full border border-gray-300" />
                    ) : (
                        <Settings className="w-6 h-6" />
                    )}
                </button>

                <button 
                    onClick={handleSync}
                    disabled={syncStatus === 'syncing' || isLoadingFeed}
                    data-testid="sync-button"
                    className={`flex items-center gap-3 px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform active:scale-95
                        ${syncStatus === 'syncing' 
                            ? 'bg-indigo-100 text-indigo-400 dark:bg-indigo-900/50 dark:text-indigo-300 cursor-wait' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                >
                    <RefreshCw className={`w-5 h-5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                    {syncStatus === 'syncing' 
                        ? `Syncing (${syncProgress.current}/${syncProgress.total})` 
                        : 'SYNC FEED'}
                </button>

                <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                    {/* Placeholder for balance/alignment */}
                    {syncStatus === 'idle' && (
                        articles.length > 0 && articles.every(a => a.isDownloaded) 
                        ? <div title="Offline Ready"><WifiOff className="w-5 h-5 text-green-500" /></div>
                        : <div title="Online Content Available"><Wifi className="w-5 h-5 text-amber-500" /></div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
          <SettingsModal 
            settings={settings} 
            user={user}
            onUpdate={setSettings} 
            onLogout={handleLogout}
            onClose={() => setShowSettings(false)} 
          />
      )}

    </div>
  );
}