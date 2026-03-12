"use client"

import { motion } from 'framer-motion'
import { NeumorphicSpinner, useReducedMotion } from '@/components/ui/loaders'

function TutorialCardSkeleton({ index }: { index: number }) {
  const prefersReduced = useReducedMotion()
  
  return (
    <motion.div
      className="bg-card border border-border rounded-xl overflow-hidden"
      initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="aspect-video bg-muted/50 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-muted/50 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-muted/50 rounded w-full animate-pulse" />
        <div className="h-3 bg-muted/50 rounded w-1/2 animate-pulse" />
        <div className="flex items-center gap-2 pt-2">
          <div className="h-6 w-16 bg-muted/50 rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-muted/50 rounded-full animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Loading() {
  const prefersReduced = useReducedMotion()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 bg-muted/50 rounded w-48 animate-pulse mb-2" />
          <div className="h-4 bg-muted/50 rounded w-80 animate-pulse" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading indicator */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <NeumorphicSpinner size={40} />
          <span className="text-sm text-muted-foreground font-mono">Carregando tutoriais...</span>
        </motion.div>
        
        {/* Filter bar skeleton */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 bg-muted/50 rounded-full animate-pulse" />
          ))}
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <TutorialCardSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
