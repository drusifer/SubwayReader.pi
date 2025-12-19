import { saveArticles, loadArticles, saveSettings, loadSettings } from './storageService';
import { Article, AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

// Declare Jest globals to fix TS errors when types are missing
declare const describe: any;
declare const it: any;
declare const beforeEach: any;
declare const expect: any;

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('storageService (Unit)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('Articles', () => {
    it('should save and load articles correctly', () => {
      const mockArticles: Article[] = [
        { 
            id: '1', 
            title: 'Test', 
            url: 'http://test', 
            category: 'test', 
            source: 'test', 
            isDownloaded: true 
        }
      ];

      saveArticles(mockArticles);
      const loaded = loadArticles();
      
      expect(loaded).toHaveLength(1);
      expect(loaded[0].title).toBe('Test');
    });

    it('should return empty array if no articles stored', () => {
      const loaded = loadArticles();
      expect(loaded).toEqual([]);
    });
  });

  describe('Settings', () => {
    it('should save and load settings correctly', () => {
      const newSettings: AppSettings = { ...DEFAULT_SETTINGS, fontSize: 24 };
      
      saveSettings(newSettings);
      const loaded = loadSettings();
      
      expect(loaded).not.toBeNull();
      expect(loaded?.fontSize).toBe(24);
    });

    it('should return null if no settings stored', () => {
      const loaded = loadSettings();
      expect(loaded).toBeNull();
    });
  });
});