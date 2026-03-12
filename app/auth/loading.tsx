"use client"

import { motion } from 'framer-motion'
import { AccessibleLoader } from '@/components/ui/loaders'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center" role="status" aria-label="Carregando">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AccessibleLoader size={48} label="Carregando autenticação..." />
      </motion.div>
    </div>
  )
}
