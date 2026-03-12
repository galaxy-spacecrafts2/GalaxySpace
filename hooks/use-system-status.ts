"use client"

import { useState, useEffect, useCallback } from 'react'

export type SystemStatus = 
  | 'checking'
  | 'online'
  | 'offline'
  | 'maintenance'
  | 'degraded'
  | 'error'

interface SystemHealth {
  status: SystemStatus
  lastCheck: Date | null
  connectionAttempts: number
  apiLatency: number | null
  databaseConnected: boolean
  websocketConnected: boolean
  errorMessage: string | null
}

const HEALTH_CHECK_INTERVAL = 10000 // 10 seconds
const MAX_RETRIES = 3
const LATENCY_THRESHOLD = 2000 // 2 seconds = degraded

export function useSystemStatus() {
  const [health, setHealth] = useState<SystemHealth>({
    status: 'checking',
    lastCheck: null,
    connectionAttempts: 0,
    apiLatency: null,
    databaseConnected: false,
    websocketConnected: false,
    errorMessage: null,
  })

  const checkHealth = useCallback(async () => {
    const startTime = Date.now()

    try {
      // Check if we're online
      if (!navigator.onLine) {
        setHealth(prev => ({
          ...prev,
          status: 'offline',
          lastCheck: new Date(),
          errorMessage: 'No internet connection',
          connectionAttempts: prev.connectionAttempts + 1,
        }))
        return
      }

      // Simulate API health check (in real app, call /api/health)
      const response = await fetch('/api/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      }).catch(() => null)

      const latency = Date.now() - startTime

      if (!response || !response.ok) {
        setHealth(prev => ({
          ...prev,
          status: prev.connectionAttempts >= MAX_RETRIES ? 'maintenance' : 'error',
          lastCheck: new Date(),
          apiLatency: latency,
          connectionAttempts: prev.connectionAttempts + 1,
          errorMessage: 'Unable to reach server',
        }))
        return
      }

      // Check if latency is too high
      const status = latency > LATENCY_THRESHOLD ? 'degraded' : 'online'

      setHealth({
        status,
        lastCheck: new Date(),
        connectionAttempts: 0,
        apiLatency: latency,
        databaseConnected: true,
        websocketConnected: true,
        errorMessage: null,
      })
    } catch (error) {
      setHealth(prev => ({
        ...prev,
        status: prev.connectionAttempts >= MAX_RETRIES ? 'maintenance' : 'error',
        lastCheck: new Date(),
        connectionAttempts: prev.connectionAttempts + 1,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      }))
    }
  }, [])

  useEffect(() => {
    // Initial check with delay to show loading animation
    const initialTimeout = setTimeout(checkHealth, 1500)
    
    // Periodic health checks
    const interval = setInterval(checkHealth, HEALTH_CHECK_INTERVAL)

    // Listen for online/offline events
    const handleOnline = () => checkHealth()
    const handleOffline = () => {
      setHealth(prev => ({
        ...prev,
        status: 'offline',
        lastCheck: new Date(),
        errorMessage: 'Connection lost',
      }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [checkHealth])

  return health
}
