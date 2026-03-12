"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Wifi, WifiOff, AlertTriangle, RefreshCw, Satellite } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import type { SystemStatus } from '@/hooks/use-system-status'

interface MaintenanceScreenProps {
  status: SystemStatus
  errorMessage?: string | null
  onRetry?: () => void
}

export function MaintenanceScreen({ status, errorMessage, onRetry }: MaintenanceScreenProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const statusConfig = {
    offline: {
      icon: WifiOff,
      title: 'Connection Lost',
      subtitle: 'We lost connection to ground control',
      color: 'text-orange-500',
      bgGlow: 'bg-orange-500/20',
    },
    maintenance: {
      icon: Satellite,
      title: 'We Will Be Back Soon!',
      subtitle: 'Mission Control is undergoing maintenance',
      color: 'text-primary',
      bgGlow: 'bg-primary/20',
    },
    error: {
      icon: AlertTriangle,
      title: 'Technical Difficulties',
      subtitle: 'Experiencing temporary issues',
      color: 'text-red-500',
      bgGlow: 'bg-red-500/20',
    },
    degraded: {
      icon: Wifi,
      title: 'Degraded Performance',
      subtitle: 'Connection is slow but operational',
      color: 'text-yellow-500',
      bgGlow: 'bg-yellow-500/20',
    },
    checking: {
      icon: RefreshCw,
      title: 'Establishing Connection',
      subtitle: 'Connecting to Mission Control',
      color: 'text-primary',
      bgGlow: 'bg-primary/20',
    },
    online: {
      icon: Wifi,
      title: 'Connected',
      subtitle: 'All systems nominal',
      color: 'text-green-500',
      bgGlow: 'bg-green-500/20',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animated background stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-foreground/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Pulsing glow effect */}
        <motion.div
          className={`absolute w-[600px] h-[600px] rounded-full ${config.bgGlow} blur-[150px]`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Main content */}
        <div className="relative z-10 text-center px-6 max-w-lg">
          {/* Animated rocket/icon */}
          <motion.div
            className="relative mx-auto mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Orbiting element */}
            <motion.div
              className="absolute inset-0 w-32 h-32 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full"
              />
            </motion.div>

            {/* Icon container */}
            <motion.div
              className={`relative w-32 h-32 mx-auto rounded-full border-2 border-border bg-card flex items-center justify-center ${config.color}`}
              animate={status === 'checking' ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Icon className="w-16 h-16" />
            </motion.div>

            {/* Rocket animation for maintenance */}
            {status === 'maintenance' && (
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2"
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Rocket className="w-10 h-10 text-primary rotate-[-45deg]" />
              </motion.div>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {config.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg text-muted-foreground mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {config.subtitle}
          </motion.p>

          {/* Loading dots */}
          <motion.p
            className="text-muted-foreground font-mono h-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {status === 'checking' ? `Initializing systems${dots}` : ''}
            {status === 'maintenance' ? `Our team is working on it${dots}` : ''}
            {status === 'offline' ? `Attempting to reconnect${dots}` : ''}
            {status === 'error' ? `Retrying connection${dots}` : ''}
          </motion.p>

          {/* Error message */}
          {errorMessage && (
            <motion.p
              className="text-sm text-muted-foreground font-mono mt-4 bg-card border border-border rounded-lg px-4 py-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              Error: {errorMessage}
            </motion.p>
          )}

          {/* Retry button */}
          {(status === 'offline' || status === 'error') && onRetry && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8"
            >
              <Button
                onClick={onRetry}
                variant="outline"
                size="lg"
                className="border-border bg-card hover:bg-secondary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Status indicators */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-8 text-xs font-mono text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-muted'}`}
                animate={status !== 'online' ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span>API</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-muted'}`}
                animate={status !== 'online' ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
              <span>Database</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-muted'}`}
                animate={status !== 'online' ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              />
              <span>WebSocket</span>
            </div>
          </motion.div>

          {/* Galaxy.SpaceCrafts branding */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-2 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Rocket className="w-4 h-4" />
            <span className="font-mono text-sm">Galaxy.SpaceCrafts</span>
          </motion.div>
        </div>

        {/* Scan line effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
