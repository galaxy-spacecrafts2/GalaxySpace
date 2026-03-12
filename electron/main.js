const { app, BrowserWindow, ipcMain, shell, session } = require('electron')
const path = require('path')
const https = require('https')
const http = require('http')

// Configuration
const isDev = process.env.NODE_ENV === 'development'
const SERVER_URL = process.env.SERVER_URL || 'https://galaxy-spacecrafts.vercel.app'
const DEV_URL = 'http://localhost:3000'

let mainWindow = null
let authToken = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    backgroundColor: '#000000',
    titleBarStyle: 'hiddenInset',
    frame: process.platform === 'darwin' ? true : false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    show: false,
  })

  // Custom title bar for Windows/Linux
  if (process.platform !== 'darwin') {
    mainWindow.setMenuBarVisibility(false)
  }

  // Load the app
  const startUrl = isDev ? DEV_URL : SERVER_URL
  mainWindow.loadURL(startUrl)

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Store session token from QR login
ipcMain.handle('store-auth-token', async (event, token) => {
  authToken = token
  
  // Set cookie for session
  const cookie = {
    url: isDev ? DEV_URL : SERVER_URL,
    name: 'session_token',
    value: token,
    secure: true,
    httpOnly: true,
    expirationDate: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) // 30 days
  }
  
  try {
    await session.defaultSession.cookies.set(cookie)
    return { success: true }
  } catch (error) {
    console.error('Failed to store auth token:', error)
    return { success: false, error: error.message }
  }
})

// Get stored auth token
ipcMain.handle('get-auth-token', async () => {
  try {
    const cookies = await session.defaultSession.cookies.get({ name: 'session_token' })
    return cookies[0]?.value || null
  } catch (error) {
    return null
  }
})

// Clear auth token (logout)
ipcMain.handle('clear-auth-token', async () => {
  authToken = null
  try {
    await session.defaultSession.cookies.remove(isDev ? DEV_URL : SERVER_URL, 'session_token')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Check QR code login status
ipcMain.handle('check-qr-login', async (event, sessionId) => {
  return new Promise((resolve) => {
    const url = `${isDev ? DEV_URL : SERVER_URL}/api/auth/qr/check?sessionId=${sessionId}`
    const client = isDev ? http : https
    
    client.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch {
          resolve({ status: 'error', message: 'Invalid response' })
        }
      })
    }).on('error', (error) => {
      resolve({ status: 'error', message: error.message })
    })
  })
})

// Window controls for custom title bar
ipcMain.handle('window-minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('window-close', () => {
  mainWindow?.close()
})

ipcMain.handle('window-is-maximized', () => {
  return mainWindow?.isMaximized() || false
})

// App lifecycle
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Security: Prevent navigation to unknown URLs
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    const allowedOrigins = [
      'localhost',
      'galaxy-spacecrafts.vercel.app',
      'accounts.google.com',
      'github.com'
    ]
    
    const isAllowed = allowedOrigins.some(origin => 
      parsedUrl.hostname === origin || parsedUrl.hostname.endsWith('.' + origin)
    )
    
    if (!isAllowed) {
      event.preventDefault()
      shell.openExternal(navigationUrl)
    }
  })
})
