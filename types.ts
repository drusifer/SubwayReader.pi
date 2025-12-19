export interface Article {
  id: string;
  title: string;
  url: string;
  category: string;
  source: string;
  summary?: string;
  content?: string; // Markdown content
  isDownloaded: boolean;
  syncError?: boolean; // If the last sync attempt failed (e.g. 404)
  cachedAt?: string;
}

export type AppView = 'feed' | 'reader';
export type SyncStatus = 'idle' | 'syncing' | 'error';
export type FontFamily = 'serif' | 'sans';

export interface AppSettings {
  simulatedMode: boolean;
  darkMode: boolean;
  fontSize: number; // in pixels (base) or rem scale
  fontFamily: FontFamily;
  interests: string; // User defined topics for personalization
}

export interface ProxyResponse {
    title: string;
    content: string;
    excerpt?: string;
    siteName?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}