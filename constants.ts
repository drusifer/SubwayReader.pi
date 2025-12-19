import { Article, AppSettings } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  serverUrl: 'http://raspberrypi.local:3000', // Example default
  simulatedMode: true,
  darkMode: false,
  fontSize: 18,
  fontFamily: 'serif',
};

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Future of Offline-First Web Apps',
    url: 'https://example.com/future-offline',
    category: 'Tech',
    source: 'TechCrunch',
    summary: 'A look into how PWAs are changing the landscape of mobile browsing in low-connectivity areas.',
    isDownloaded: false,
  },
  {
    id: '2',
    title: 'Understanding Node.js Proxies',
    url: 'https://example.com/node-proxy',
    category: 'Code',
    source: 'Hacker News',
    summary: 'Why you might need a self-hosted proxy server for your personal web scraping projects.',
    isDownloaded: false,
  },
  {
    id: '3',
    title: 'Minimalist Living in 2024',
    url: 'https://example.com/minimalism',
    category: 'Lifestyle',
    source: 'The Atlantic',
    summary: 'How decluttering your digital life can lead to better mental health and focus.',
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
