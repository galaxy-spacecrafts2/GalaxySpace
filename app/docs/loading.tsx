"use client"

import { motion } from 'framer-motion'
import { LiquidLoader, useReducedMotion } from '@/components/ui/loaders'

export default function Loading() {
  const prefersReduced = useReducedMotion()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar skeleton */}
      <div className="hidden lg:block w-64 border-r border-border p-4 space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <motion.div
            key={i}
            className="h-8 bg-muted/50 rounded animate-pulse"
            initial={prefersReduced ? {} : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
      </div>
      
      {/* Main content skeleton */}
      <div className="flex-1 p-8">
        <motion.div
          className="flex flex-col items-center justify-center h-64"
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LiquidLoader size={80} />
          <p className="mt-6 text-sm text-muted-foreground font-mono">Carregando documentação...</p>
        </motion.div>
        
        <div className="mt-8 space-y-4 max-w-3xl">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="h-4 bg-muted/50 rounded animate-pulse"
              style={{ width: `${100 - i * 10}%` }}
              initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
