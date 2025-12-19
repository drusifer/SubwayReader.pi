import { Article, AppSettings } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  serverUrl: 'http://darius:3000',
  simulatedMode: false, // Default to Live Mode as requested
  darkMode: false,
  fontSize: 18,
  fontFamily: 'serif',
};

// Fallback data in case Gemini API fails or quota is exceeded
export const FALLBACK_ARTICLES: Article[] = [
  {
    id: 'fallback-1',
    title: 'History of the World Wide Web',
    url: 'https://en.wikipedia.org/wiki/History_of_the_World_Wide_Web',
    category: 'History',
    source: 'Wikipedia',
    summary: 'A deep dive into how the web was created.',
    isDownloaded: false,
  },
  {
    id: 'fallback-2',
    title: 'Maker\'s Schedule, Manager\'s Schedule',
    url: 'http://www.paulgraham.com/makersschedule.html',
    category: 'Essay',
    source: 'Paul Graham',
    summary: 'Why programmers hate meetings.',
    isDownloaded: false,
  },
  {
    id: 'fallback-3',
    title: 'The Manifesto for Agile Software Development',
    url: 'https://agilemanifesto.org/principles.html',
    category: 'Tech',
    source: 'Agile Alliance',
    summary: 'The founding principles of modern software development.',
    isDownloaded: false,
  },
];

export const MOCK_MARKDOWN_CONTENT = `
# The Future of Offline-First Web Apps

**By Jane Doe**

In a world where we are constantly connected, the moments where we lose that connection can feel jarring. However, a new wave of **Progressive Web Apps (PWAs)** is designed to bridge this gap.

## Why Offline Matters

Imagine you are on a subway. The train goes underground, and your connection drops. Most apps stop working. Offline-first apps, however, continue to function seamlessly.

> "The user shouldn't care about the network status. The app should just work."

### Key Technologies

1.  **Service Workers:** The backbone of offline capability.
2.  **IndexedDB / LocalStorage:** For storing large amounts of data.
3.  **Background Sync:** For deferring actions until connectivity returns.

## Conclusion

As web capabilities grow, the line between native apps and web apps blurs. Offline-first is not just a feature; it's a necessity for a robust user experience in an imperfect network world.
`;