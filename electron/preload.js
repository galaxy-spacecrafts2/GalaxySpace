const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  isElectron: true,
  
  // Auth methods
  storeAuthToken: (token) => ipcRenderer.invoke('store-auth-token', token),
  getAuthToken: () => ipcRenderer.invoke('get-auth-token'),
  clearAuthToken: () => ipcRenderer.invoke('clear-auth-token'),
  checkQRLogin: (sessionId) => ipcRenderer.invoke('check-qr-login', sessionId),
  
  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  
  // Event listeners for window state
  onMaximizeChange: (callback) => {
    ipcRenderer.on('maximize-change', (event, isMaximized) => callback(isMaximized))
  },
})

// Add custom class to body when running in Electron
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('electron-app')
  
  // Add platform-specific class
  document.body.classList.add(`platform-${process.platform}`)
})
