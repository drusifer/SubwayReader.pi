import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { launchBrowser, closeBrowser } from './browser'
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

vi.mock('puppeteer-core')
vi.mock('node:fs')

describe('Browser Manager', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    afterEach(async () => {
        await closeBrowser()
    })

    it('should throw error if chrome not found', async () => {
        vi.spyOn(fs, 'existsSync').mockReturnValue(false)
        await expect(launchBrowser()).rejects.toThrow(/executable not found/)
    })

    it('should launch browser if found', async () => {
        vi.spyOn(fs, 'existsSync').mockReturnValue(true)
        const mockBrowser = { close: vi.fn(), newPage: vi.fn() }
        vi.mocked(puppeteer.launch).mockResolvedValue(mockBrowser as any)

        const b = await launchBrowser()
        expect(puppeteer.launch).toHaveBeenCalled()
        expect(b).toBe(mockBrowser)
    })
})
