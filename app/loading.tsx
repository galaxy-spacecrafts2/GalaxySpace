"use client"

import { motion } from 'framer-motion'
import { GlassLoader, LoadingMessage, useReducedMotion } from '@/components/ui/loaders'

export default function Loading() {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center" role="status" aria-label="Carregando">
        <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full" />
        <p className="mt-4 text-sm text-muted-foreground font-mono">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center" role="status" aria-label="Carregando">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <GlassLoader size={100} />
      </motion.div>
      
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <LoadingMessage />
      </motion.div>
    </div>
  )
}
