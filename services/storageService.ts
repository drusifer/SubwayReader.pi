import { Article, AppSettings } from '../types';

const KEYS = {
  ARTICLES: 'subway_articles',
  SETTINGS: 'subway_settings',
};

export const saveArticles = (articles: Article[]) => {
  try {
    localStorage.setItem(KEYS.ARTICLES, JSON.stringify(articles));
  } catch (e) {
    console.error("Failed to save articles", e);
  }
};

export const loadArticles = (): Article[] => {
  try {
    const data = localStorage.getItem(KEYS.ARTICLES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load articles", e);
    return [];
  }
};

export const clearArticles = () => {
  try {
    localStorage.removeItem(KEYS.ARTICLES);
  } catch (e) {
    console.error("Failed to clear articles", e);
  }
};

export const saveSettings = (settings: AppSettings) => {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};

export const loadSettings = (): AppSettings | null => {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load settings", e);
    return null;
  }
};