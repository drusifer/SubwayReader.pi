import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'node:path'
import { getSources, addSource, deleteSource } from './db/models/source'
import { getUnreadArticles } from './db/models/article'
import { runSync } from './scraper/aggregator'

// The built directory structure
//
// ├─┬─ dist
// │ ├─┬─ electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
// ├─┬─ dist-electron
// │ ├── main.js
// │ └── preload.js
//
process.env.DIST = join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
    const publicDir = process.env.VITE_PUBLIC || ''
    const distDir = process.env.DIST || ''

    win = new BrowserWindow({
        icon: join(publicDir, 'electron-vite.svg'),
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
        },
    })

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(join(distDir, 'index.html'))
    }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(() => {
    // IPC Handlers
    ipcMain.handle('db:source:list', () => getSources())
    ipcMain.handle('db:source:add', (_event, name, url) => addSource(name, url))
    ipcMain.handle('db:source:delete', (_event, id) => deleteSource(id))

    // Article Handlers
    ipcMain.handle('db:article:list', () => getUnreadArticles())

    // Scraper Handlers
    ipcMain.handle('scraper:sync', () => runSync())

    createWindow()
})
