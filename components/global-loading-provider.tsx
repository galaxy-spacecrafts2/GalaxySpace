"use client"

import { createContext, useContext, useState, ReactNode, useCallback, useEffect, Suspense } from 'react'
import { TopProgressBar, EnhancedFullPageLoader, useReducedMotion } from '@/components/ui/loaders'
import { usePathname, useSearchParams } from 'next/navigation'

interface LoadingContextType {
  isNavigating: boolean
  isPageLoading: boolean
  showFullPageLoader: (variant?: 'glass' | 'liquid' | 'neumorphic' | 'minimal') => void
  hideFullPageLoader: () => void
  startNavigation: () => void
  endNavigation: () => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

export function useGlobalLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    // Always return safe default for any missing context
    return {
      isNavigating: false,
      isPageLoading: false,
      showFullPageLoader: () => {},
      hideFullPageLoader: () => {},
      startNavigation: () => {},
      endNavigation: () => {},
    }
  }
  return context
}

interface GlobalLoadingProviderProps {
  children: ReactNode
}

// Inner component that uses hooks requiring Suspense
function GlobalLoadingContent({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [loaderVariant, setLoaderVariant] = useState<'glass' | 'liquid' | 'neumorphic' | 'minimal'>('glass')
  const prefersReducedMotion = useReducedMotion()
  
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track route changes for navigation progress
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname, searchParams])

  const showFullPageLoader = useCallback((variant: 'glass' | 'liquid' | 'neumorphic' | 'minimal' = 'glass') => {
    setLoaderVariant(variant)
    setIsPageLoading(true)
  }, [])

  const hideFullPageLoader = useCallback(() => {
    setIsPageLoading(false)
  }, [])

  const startNavigation = useCallback(() => {
    setIsNavigating(true)
  }, [])

  const endNavigation = useCallback(() => {
    setIsNavigating(false)
  }, [])

  return (
    <LoadingContext.Provider
      value={{
        isNavigating,
        isPageLoading,
        showFullPageLoader,
        hideFullPageLoader,
        startNavigation,
        endNavigation,
      }}
    >
      {/* Top Progress Bar - Always visible during navigation */}
      <TopProgressBar isLoading={isNavigating} />
      
      {/* Full Page Loader - For heavy operations */}
      {!prefersReducedMotion && (
        <EnhancedFullPageLoader
          isLoading={isPageLoading}
          variant={loaderVariant}
          showMessage
          showProgress
        />
      )}
      
      {children}
    </LoadingContext.Provider>
  )
}

export function GlobalLoadingProvider({ children }: GlobalLoadingProviderProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <GlobalLoadingContent>
        {children}
      </GlobalLoadingContent>
    </Suspense>
  )
}
