"use client"

import { ReactNode } from 'react'
import { GlobalLoadingProvider } from './global-loading-provider'

interface LoadingProviderWrapperProps {
  children: ReactNode
}

export function LoadingProviderWrapper({ children }: LoadingProviderWrapperProps) {
  return (
    <GlobalLoadingProvider>
      {children}
    </GlobalLoadingProvider>
  )
}
