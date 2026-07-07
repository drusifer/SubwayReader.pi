import { Source, Article } from './types'

// Define the shape of the exposed API in preload.ts
declare global {
    interface Window {
        db: {
            getSources: () => Promise<Source[]>
            addSource: (name: string, url: string) => Promise<number>
            deleteSource: (id: number) => Promise<void>
            getUnreadArticles: () => Promise<Article[]>
        }
        scraper: {
            sync: () => Promise<{ count: number }>
        }
    }
}

export const api = {
    getSources: () => window.db.getSources(),
    addSource: (name: string, url: string) => window.db.addSource(name, url),
    deleteSource: (id: number) => window.db.deleteSource(id),
    getUnreadArticles: () => window.db.getUnreadArticles(),
    sync: () => window.scraper.sync()
}
