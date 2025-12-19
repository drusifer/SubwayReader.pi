import React, { useState, useEffect, useCallback } from 'react';
import { Settings, RefreshCw, BookOpen, WifiOff, Wifi, AlertCircle } from 'lucide-react';
import { Article, AppView, SyncStatus, AppSettings } from './types';
import { MOCK_ARTICLES, DEFAULT_SETTINGS } from './constants';
import * as storageService from './services/storageService';
import * as proxyService from './services/proxyService';
import * as geminiService from './services/geminiService';
import ArticleCard from './components/ArticleCard';
import ReaderView from './components/ReaderView';
import SettingsModal from './components/SettingsModal';

export default function App() {
  // State
  const [view, setView] = useState<AppView>('feed');
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    // Load settings
    const loadedSettings = storageService.loadSettings();
    if (loadedSettings) setSettings(loadedSettings);

    // Load articles (merge mock headers with stored full content)
    const storedArticles = storageService.loadArticles();
    
    // In a real app, we might fetch the "Feed" from an RSS aggregator here.
    // For this prototype, we use the MOCK_ARTICLES as the "Live Feed" source of truth for headlines,
    // and merge with local storage to see what we have downloaded.
    
    const mergedArticles = MOCK_ARTICLES.map(mock => {
      const stored = storedArticles.find(a => a.id === mock.id);
      return stored ? { ...mock, ...stored } : mock;
    });

    setArticles(mergedArticles);
  }, []);

  // Save settings when changed
  useEffect(() => {
    storageService.saveSettings(settings);
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

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
        
        // 1. Fetch Content
        try {
            const contentData = await proxyService.fetchArticle(
                article.url, 
                settings.serverUrl, 
                settings.simulatedMode
            );
            
            // 2. Generate Summary (if needed)
            let summary = article.summary;
            if (!summary || summary.startsWith("AI generated")) {
               try {
                   summary = await geminiService.generateSummary(contentData.content);
               } catch (geminiError) {
                   console.error("Gemini summary failed:", geminiError);
                   summary = "Summary unavailable (Offline or Error)";
               }
            }

            // 3. Update Article Object
            const updatedArticle: Article = {
                ...article,
                content: contentData.content,
                title: contentData.title || article.title, // Use parsed title if better
                summary: summary,
                isDownloaded: true,
                cachedAt: new Date().toISOString()
            };

            // Update state incrementally
            const index = newArticles.findIndex(a => a.id === updatedArticle.id);
            if (index !== -1) {
                newArticles[index] = updatedArticle;
                setArticles([...newArticles]);
                storageService.saveArticles(newArticles);
            }

        } catch (err) {
            console.error(`Failed to sync article ${article.id}:`, err);
            // Continue to next article even if one fails
        }

        setSyncProgress(prev => ({ ...prev, current: i + 1 }));
      }
    } catch (e) {
        setErrorMsg("Sync batch failed unexpectedly.");
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
               {settings.simulatedMode ? (
                   <span data-testid="mode-badge" className="text-xs font-mono bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded">SIMULATED</span>
               ) : (
                   <span data-testid="mode-badge" className="text-xs font-mono bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded">LIVE</span>
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

            {articles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                onClick={() => openArticle(article.id)} 
              />
            ))}
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
                    className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                    aria-label="Settings"
                >
                    <Settings className="w-6 h-6" />
                </button>

                <button 
                    onClick={handleSync}
                    disabled={syncStatus === 'syncing'}
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
                        articles.every(a => a.isDownloaded) 
                        ? <WifiOff className="w-5 h-5 text-green-500" title="Offline Ready" /> 
                        : <Wifi className="w-5 h-5 text-amber-500" title="Online Content Available" />
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
          <SettingsModal 
            settings={settings} 
            onUpdate={setSettings} 
            onClose={() => setShowSettings(false)} 
          />
      )}

    </div>
  );
}