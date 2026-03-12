"use client"

import { useState, useCallback } from 'react'
import { useGlobalLoading } from '@/components/global-loading-provider'

interface UseLoadingOperationOptions {
  showFullPage?: boolean
  variant?: 'glass' | 'liquid' | 'neumorphic' | 'minimal'
}

export function useLoadingOperation<T>(options: UseLoadingOperationOptions = {}) {
  const { showFullPage = false, variant = 'glass' } = options
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { showFullPageLoader, hideFullPageLoader } = useGlobalLoading()

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true)
    setError(null)
    
    if (showFullPage) {
      showFullPageLoader(variant)
    }
    
    try {
      const result = await operation()
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Operação falhou')
      setError(error)
      return null
    } finally {
      setIsLoading(false)
      if (showFullPage) {
        hideFullPageLoader()
      }
    }
  }, [showFullPage, variant, showFullPageLoader, hideFullPageLoader])

  return { isLoading, error, execute }
}
