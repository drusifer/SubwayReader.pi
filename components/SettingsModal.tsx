import React from 'react';
import { AppSettings } from '../types';
import { X, Moon, Sun, Type, Server } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
  onClose: () => void;
}

export default function SettingsModal({ settings, onUpdate, onClose }: SettingsModalProps) {
  
  const handleChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold dark:text-white">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Appearance */}
          <div className="space-y-3">
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

          {/* Server Config */}
          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Server Configuration</label>
            
            <div className="flex items-center justify-between mb-2">
               <span className="text-sm font-medium dark:text-gray-200">Simulated Mode</span>
               <button 
                onClick={() => handleChange('simulatedMode', !settings.simulatedMode)}
                className={`w-10 h-5 rounded-full transition-colors relative ${settings.simulatedMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
               >
                 <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${settings.simulatedMode ? 'translate-x-5' : ''}`} />
               </button>
            </div>

            <div className={`space-y-1 transition-opacity ${settings.simulatedMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <label className="text-xs text-gray-500">Proxy Server URL</label>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
                    <Server className="w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        value={settings.serverUrl}
                        onChange={(e) => handleChange('serverUrl', e.target.value)}
                        className="bg-transparent w-full text-sm outline-none dark:text-white"
                        placeholder="http://192.168.1.X:3000"
                    />
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}