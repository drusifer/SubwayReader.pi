import { getDb } from '../index'

export interface Source {
    id: number
    name: number
    url: string
    login_url?: string
    selector_config?: any
}

export function getSources(): Source[] {
    const db = getDb()
    return db.prepare('SELECT * FROM sources').all() as Source[]
}

export function addSource(name: string, url: string, login_url?: string, selector_config?: any): number {
    const db = getDb()
    const stmt = db.prepare('INSERT INTO sources (name, url, login_url, selector_config) VALUES (?, ?, ?, ?)')
    const info = stmt.run(name, url, login_url, selector_config ? JSON.stringify(selector_config) : null)
    return info.lastInsertRowid as number
}

export function deleteSource(id: number): void {
    const db = getDb()
    db.prepare('DELETE FROM sources WHERE id = ?').run(id)
}
