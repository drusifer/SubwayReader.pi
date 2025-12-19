export interface Article {
  id: string;
  title: string;
  url: string;
  category: string;
  source: string;
  summary?: string;
  content?: string; // Markdown content
  isDownloaded: boolean;
  cachedAt?: string;
}

export type AppView = 'feed' | 'reader';
export type SyncStatus = 'idle' | 'syncing' | 'error';
export type FontFamily = 'serif' | 'sans';

export interface AppSettings {
  serverUrl: string;
  simulatedMode: boolean;
  darkMode: boolean;
  fontSize: number; // in pixels (base) or rem scale
  fontFamily: FontFamily;
}

export interface ProxyResponse {
    title: string;
    content: string;
    excerpt?: string;
    siteName?: string;
}