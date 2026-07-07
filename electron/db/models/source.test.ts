import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getSources, addSource, deleteSource } from './source'
import { getDb } from '../index'

// Mock Electron app.getPath
vi.mock('electron', () => ({
    app: {
        getPath: () => '/tmp',
        isPackaged: false
    }
}))

describe('Source Model', () => {
    beforeEach(() => {
        // Use in-memory DB for tests? 
        // Our getDb() implementation defaults to file-based in process.cwd().
        // For testing, we might want to override that or accept a path.
        // But for now, let's just let it run (it creates subway-reader-dev.db).
        // Maybe better to mock getDb in the test if we want pure isolation, 
        // OR we just ensure we clean up.

        // Actually, let's just run it. The `index.ts` uses process.cwd(). 
        // We should probably clear table before each test.
        const db = getDb()
        db.exec('DELETE FROM sources')
    })

    afterEach(() => {
        // closeDb()
    })

    it('should create and retrieve a source', () => {
        const id = addSource('Test News', 'https://test.com')
        expect(id).toBeGreaterThan(0)

        const sources = getSources()
        expect(sources).toHaveLength(1)
        expect(sources[0].name).toBe('Test News')
        expect(sources[0].url).toBe('https://test.com')
    })

    it('should delete a source', () => {
        const id = addSource('Delete Me', 'https://del.com')
        deleteSource(id)
        const sources = getSources()
        expect(sources).toHaveLength(0)
    })
})
