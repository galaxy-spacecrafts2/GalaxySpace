"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed as PWA
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true
      setIsStandalone(isStandaloneMode)
    }
    checkStandalone()

    // Check for iOS
    const checkIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent)
      setIsIOS(isIOSDevice)
    }
    checkIOS()

    // Listen for beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after a delay if not dismissed before
      const dismissed = localStorage.getItem('pwa-prompt-dismissed')
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS, show prompt after delay if not already installed
    if (!isStandalone) {
      const dismissed = localStorage.getItem('pwa-prompt-dismissed')
      if (!dismissed) {
        setTimeout(() => {
          const userAgent = window.navigator.userAgent.toLowerCase()
          if (/iphone|ipad|ipod/.test(userAgent)) {
            setShowPrompt(true)
          }
        }, 5000)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isStandalone])

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowPrompt(false)
      }
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // Don't show if already installed
  if (isStandalone) return null

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-card border border-border rounded-lg p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                {isIOS ? (
                  <Smartphone className="w-6 h-6 text-primary" />
                ) : (
                  <Download className="w-6 h-6 text-primary" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground mb-1">Install Galaxy.SC</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {isIOS 
                    ? 'Add this app to your home screen for quick access and offline support.'
                    : 'Install our app for a better experience with offline support and push notifications.'
                  }
                </p>
                
                {isIOS ? (
                  <div className="text-xs text-muted-foreground bg-secondary p-3 rounded-md">
                    <p className="mb-2">To install:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Tap the Share button in Safari</li>
                      <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
                      <li>Tap &quot;Add&quot; to confirm</li>
                    </ol>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleInstall}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Install
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={handleDismiss}
                    >
                      Not now
                    </Button>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-secondary rounded transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            {/* Desktop vs Mobile indicator */}
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
              <Monitor className="w-3 h-3" />
              <span>Works on desktop & mobile</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
