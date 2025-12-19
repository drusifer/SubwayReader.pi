import React, { useEffect } from 'react';
import { AppSettings, UserProfile } from '../types';
import { X, Moon, Sun, Type, Trash2, User, LogOut } from 'lucide-react';
import * as storageService from '../services/storageService';
import * as authService from '../services/authService';

interface SettingsModalProps {
  settings: AppSettings;
  user: UserProfile | null;
  onUpdate: (settings: AppSettings) => void;
  onLogout: () => void;
  onClose: () => void;
}

export default function SettingsModal({ settings, user, onUpdate, onLogout, onClose }: SettingsModalProps) {
  
  // Initialize Google Button when modal opens if user is not logged in
  useEffect(() => {
    if (!user) {
        // Short delay to ensure DOM is ready
        setTimeout(() => {
            authService.renderGoogleButton("google-sign-in-button");
        }, 100);
    }
  }, [user]);

  const handleChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onUpdate({ ...settings, [key]: value });
  };

  const handleClearCache = () => {
    if (confirm("Are you sure you want to delete all downloaded articles? This cannot be undone.")) {
      storageService.clearArticles();
      window.location.reload(); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold dark:text-white">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Account / OAuth */}
          <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3 h-3" />
                Account
            </label>
            {user ? (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg flex items-center gap-3">
                    <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-600" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Sign Out">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div>
                   <div id="google-sign-in-button" className="min-h-[44px]"></div>
                   <p className="text-xs text-gray-400 mt-2">Sign in to personalize your feed.</p>
                </div>
            )}
          </div>

          {/* Personalization */}
          <div className="space-y-3">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Interests
             </label>
             <textarea 
               value={settings.interests}
               onChange={(e) => handleChange('interests', e.target.value)}
               placeholder="e.g. Technology, NYT, Cooking, Ancient History"
               className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-gray-100 h-24 resize-none"
             />
          </div>
          
          {/* Appearance */}
          <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Appearance</label>
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
               <span className="flex items-center gap-2 text-sm font-medium dark:text-gray-200">
                 {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                 Dark Mode
               </span>
               <button 
                onClick={() => handleChange('darkMode', !settings.darkMode)}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
               >
                 <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.darkMode ? 'translate-x-6' : ''}`} />
               </button>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Typography</label>
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleChange('fontFamily', 'sans')}
                  className={`flex-1 py-2 text-sm rounded-lg border ${settings.fontFamily === 'sans' ? 'border-indigo-600 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
                >
                  Sans-Serif
                </button>
                <button 
                   onClick={() => handleChange('fontFamily', 'serif')}
                   className={`flex-1 py-2 text-sm rounded-lg border font-serif ${settings.fontFamily === 'serif' ? 'border-indigo-600 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
                >
                  Serif
                </button>
             </div>
             
             <div className="flex items-center gap-3">
                <Type className="w-4 h-4 text-gray-400" />
                <input 
                  type="range" 
                  min="14" 
                  max="24" 
                  value={settings.fontSize}
                  onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="text-sm w-8 text-right dark:text-gray-300">{settings.fontSize}px</span>
             </div>
          </div>

          {/* Server Config / Simulation Toggle */}
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
               <span className="text-sm font-medium dark:text-gray-200">Simulated Mode (No AI)</span>
               <button 
                onClick={() => handleChange('simulatedMode', !settings.simulatedMode)}
                className={`w-10 h-5 rounded-full transition-colors relative ${settings.simulatedMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
               >
                 <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${settings.simulatedMode ? 'translate-x-5' : ''}`} />
               </button>
            </div>
          </div>

          {/* Storage Management */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
             <button 
                onClick={handleClearCache}
                className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors text-sm font-medium"
             >
                <Trash2 className="w-4 h-4" />
                Clear Offline Data
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}