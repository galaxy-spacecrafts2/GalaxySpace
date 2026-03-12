'use client'

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for mobile platform environment variable
  if (process.env.NEXT_PUBLIC_PLATFORM === 'mobile') return true
  
  // Check for Capacitor/Cordova mobile runtime
  if ((window as any).Capacitor) return true
  
  // User agent detection
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ''
  
  // Common mobile indicators
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i
  const isMobileUA = mobileRegex.test(userAgent)
  
  // Screen size detection (less reliable but helpful)
  const isSmallScreen = window.innerWidth <= 768
  
  // Touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // Combined detection
  return isMobileUA || (isSmallScreen && hasTouch) || (window as any).Capacitor?.isNative
}

export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false
  
  return (window as any).Capacitor?.isNative === true || 
         process.env.NEXT_PUBLIC_PLATFORM === 'mobile'
}

export function getDeviceInfo() {
  if (typeof window === 'undefined') return null
  
  return {
    isMobile: isMobileDevice(),
    isNative: isNativeApp(),
    platform: getPlatform(),
    userAgent: navigator.userAgent,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    hasCamera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }
}

function getPlatform(): 'ios' | 'android' | 'web' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown'
  
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
    return 'ios'
  }
  
  if (userAgent.includes('android')) {
    return 'android'
  }
  
  if ((window as any).Capacitor?.getPlatform) {
    const platform = (window as any).Capacitor.getPlatform()
    if (platform === 'ios' || platform === 'android') {
      return platform
    }
  }
  
  return 'web'
}
