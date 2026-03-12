"use client"

import { motion } from 'framer-motion'
import { WaveLoader, useReducedMotion } from '@/components/ui/loaders'

function ArticleSkeleton() {
  const prefersReduced = useReducedMotion()
  
  return (
    <motion.div
      className="bg-card border border-border rounded-xl p-6 space-y-4"
      initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="h-48 bg-muted/50 rounded-lg animate-pulse" />
      <div className="space-y-2">
        <div className="h-6 bg-muted/50 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-muted/50 rounded w-full animate-pulse" />
        <div className="h-4 bg-muted/50 rounded w-2/3 animate-pulse" />
      </div>
      <div className="flex items-center gap-4 pt-2">
        <div className="h-8 w-8 bg-muted/50 rounded-full animate-pulse" />
        <div className="h-4 bg-muted/50 rounded w-24 animate-pulse" />
      </div>
    </motion.div>
  )
}

export default function Loading() {
  const prefersReduced = useReducedMotion()

  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="border-b border-border bg-card/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 bg-muted/50 rounded w-48 animate-pulse mb-2" />
          <div className="h-4 bg-muted/50 rounded w-96 animate-pulse" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading indicator */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <WaveLoader />
          <span className="text-sm text-muted-foreground font-mono">Carregando artigos...</span>
        </motion.div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ArticleSkeleton />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
