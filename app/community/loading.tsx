"use client"

import { motion } from 'framer-motion'
import { GlassLoader, LoadingMessage, useReducedMotion } from '@/components/ui/loaders'

export default function Loading() {
  const prefersReduced = useReducedMotion()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center" role="status" aria-label="Carregando comunidade">
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <GlassLoader size={100} />
      </motion.div>
      
      <motion.div
        className="mt-8 text-center"
        initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <LoadingMessage />
        <p className="mt-2 text-xs text-muted-foreground">Conectando com a comunidade...</p>
      </motion.div>
    </div>
  )
}
