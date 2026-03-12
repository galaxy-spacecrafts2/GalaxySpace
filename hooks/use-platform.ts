'use client'

import { useState, useEffect } from 'react'

interface PlatformInfo {
  isElectron: boolean
  isCapacitor: boolean
  isWeb: boolean
  isAndroid: boolean
  isIOS: boolean
  isWindows: boolean
  isMac: boolean
  isLinux: boolean
  isMobile: boolean
  isDesktop: boolean
  platform: 'electron' | 'capacitor' | 'web'
  os: 'android' | 'ios' | 'windows' | 'mac' | 'linux' | 'unknown'
  deviceType: 'mobile' | 'tablet' | 'desktop'
}

export function usePlatform(): PlatformInfo {
  const [platform, setPlatform] = useState<PlatformInfo>({
    isElectron: false,
    isCapacitor: false,
    isWeb: true,
    isAndroid: false,
    isIOS: false,
    isWindows: false,
    isMac: false,
    isLinux: false,
    isMobile: false,
    isDesktop: true,
    platform: 'web',
    os: 'unknown',
    deviceType: 'desktop',
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ua = navigator.userAgent.toLowerCase()
    const electronAPI = (window as any).electronAPI
    const Capacitor = (window as any).Capacitor

    // Detect platform
    const isElectron = !!electronAPI?.isElectron
    const isCapacitor = !!Capacitor?.isNativePlatform?.()
    const isWeb = !isElectron && !isCapacitor

    // Detect OS
    const isAndroid = /android/i.test(ua)
    const isIOS = /iphone|ipad|ipod/i.test(ua)
    const isWindows = /windows/i.test(ua)
    const isMac = /macintosh|mac os x/i.test(ua)
    const isLinux = /linux/i.test(ua) && !isAndroid

    // Detect device type
    const isMobile = isAndroid || isIOS || /mobile/i.test(ua)
    const isTablet = /tablet|ipad/i.test(ua) || (isAndroid && !/mobile/i.test(ua))
    const isDesktop = !isMobile && !isTablet

    // Determine OS string
    let os: PlatformInfo['os'] = 'unknown'
    if (isAndroid) os = 'android'
    else if (isIOS) os = 'ios'
    else if (isWindows) os = 'windows'
    else if (isMac) os = 'mac'
    else if (isLinux) os = 'linux'

    // Determine device type
    let deviceType: PlatformInfo['deviceType'] = 'desktop'
    if (isMobile && !isTablet) deviceType = 'mobile'
    else if (isTablet) deviceType = 'tablet'

    setPlatform({
      isElectron,
      isCapacitor,
      isWeb,
      isAndroid,
      isIOS,
      isWindows,
      isMac,
      isLinux,
      isMobile: isMobile || isTablet,
      isDesktop,
      platform: isElectron ? 'electron' : isCapacitor ? 'capacitor' : 'web',
      os,
      deviceType,
    })
  }, [])

  return platform
}

// Electron API helpers
export function useElectronAPI() {
  const platform = usePlatform()

  const storeAuthToken = async (token: string) => {
    if (platform.isElectron && typeof window !== 'undefined') {
      return (window as any).electronAPI?.storeAuthToken(token)
    }
    return null
  }

  const getAuthToken = async () => {
    if (platform.isElectron && typeof window !== 'undefined') {
      return (window as any).electronAPI?.getAuthToken()
    }
    return null
  }

  const clearAuthToken = async () => {
    if (platform.isElectron && typeof window !== 'undefined') {
      return (window as any).electronAPI?.clearAuthToken()
    }
    return null
  }

  const windowControls = {
    minimize: () => (window as any).electronAPI?.minimize(),
    maximize: () => (window as any).electronAPI?.maximize(),
    close: () => (window as any).electronAPI?.close(),
    isMaximized: () => (window as any).electronAPI?.isMaximized(),
  }

  return {
    ...platform,
    storeAuthToken,
    getAuthToken,
    clearAuthToken,
    windowControls,
  }
}

// Capacitor API helpers
export function useCapacitorAPI() {
  const platform = usePlatform()

  const scanQRCode = async () => {
    if (!platform.isCapacitor) return null

    try {
      // Use native camera API via Capacitor Camera plugin (built-in)
      // For QR scanning, we use the web-based approach with getUserMedia
      return { error: 'Use camera to scan QR codes' }
    } catch {
      return { error: 'Scanner error' }
    }
  }

  const stopScanning = async () => {
    if (!platform.isCapacitor) return
    // Cleanup if needed
  }

  const hapticFeedback = async (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!platform.isCapacitor) return

    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
      
      const styleMap = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy,
      }
      
      await Haptics.impact({ style: styleMap[type] })
    } catch {
      // Ignore errors
    }
  }

  return {
    ...platform,
    scanQRCode,
    stopScanning,
    hapticFeedback,
  }
}
