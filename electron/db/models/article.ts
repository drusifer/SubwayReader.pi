import { getDb } from '../index'

export interface Article {
    id?: number
    source_id: number
    title: string
    url: string
    author?: string
    published_at?: string
    crawled_at: string
    local_path?: string
    is_read: number // 0 or 1
    is_paywalled?: number
}

export function saveArticle(article: Article): number | bigint {
    const db = getDb()
    try {
        const stmt = db.prepare(`
      INSERT INTO articles (source_id, title, url, author, published_at, crawled_at, local_path, is_read, is_paywalled)
      VALUES (@source_id, @title, @url, @author, @published_at, @crawled_at, @local_path, @is_read, @is_paywalled)
    `)
        const info = stmt.run(article)
        return info.lastInsertRowid
    } catch (err: any) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            // Already exists, maybe update? For now, ignore.
            return 0
        }
        throw err
    }
}

export function getUnreadArticles(): Article[] {
    const db = getDb()
    return db.prepare('SELECT * FROM articles WHERE is_read = 0 ORDER BY crawled_at DESC').all() as Article[]
}

export function markRead(id: number): void {
    const db = getDb()
    db.prepare('UPDATE articles SET is_read = 1 WHERE id = ?').run(id)
}
