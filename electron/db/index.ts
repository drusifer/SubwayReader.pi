import Database from 'better-sqlite3'
import { join } from 'node:path'
import { app } from 'electron'
import { SCHEMA } from './schema'

let db: Database.Database | null = null

export function getDb() {
    if (db) return db

    // In production, store persistence in userData. In dev, keep it local or memory.
    const dbPath = app.isPackaged
        ? join(app.getPath('userData'), 'subway-reader.db')
        : join(process.cwd(), 'subway-reader-dev.db')

    db = new Database(dbPath)

    // Enforce WAL mode for better concurrency/performance
    db.pragma('journal_mode = WAL')

    // Initialize Schema
    db.exec(SCHEMA)

    return db
}

export function closeDb() {
    if (db) {
        db.close()
        db = null
    }
}
