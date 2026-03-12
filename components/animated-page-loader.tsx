"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, ReactNode, useMemo } from 'react'

interface AnimatedPageLoaderProps {
  children: ReactNode
  isReady: boolean
}

// Individual panel animation wrapper
export function AnimatedPanel({ 
  children, 
  index,
  isVisible,
}: { 
  children: ReactNode
  index: number
  isVisible: boolean
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Generate random values only after mounting on client to avoid hydration mismatch
  const randomValues = useMemo(() => {
    if (!isMounted) {
      return { x: 0, y: 0, rotate: 0, scale: 1 }
    }
    return {
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      rotate: (Math.random() - 0.5) * 30,
      scale: 0.5 + Math.random() * 0.3,
    }
  }, [isMounted])

  return (
    <motion.div
      initial={isMounted ? { 
        opacity: 0,
        x: randomValues.x,
        y: randomValues.y,
        rotate: randomValues.rotate,
        scale: randomValues.scale,
        filter: 'blur(10px)',
      } : { opacity: 1 }}
      animate={isVisible ? { 
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        filter: 'blur(0px)',
      } : {}}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.08,
        duration: 0.8,
      }}
    >
      {children}
    </motion.div>
  )
}

// Context for triggering animations
export function AnimatedPageLoader({ children, isReady }: AnimatedPageLoaderProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isReady) {
      // Small delay before showing content for dramatic effect
      const timer = setTimeout(() => setShowContent(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isReady])

  return (
    <AnimatePresence mode="wait">
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to get panel animation props
export function useAnimatedPanels(totalPanels: number, isReady: boolean) {
  const [visiblePanels, setVisiblePanels] = useState<boolean[]>(
    Array(totalPanels).fill(false)
  )

  useEffect(() => {
    if (isReady) {
      // Stagger reveal panels
      const timers = Array(totalPanels).fill(null).map((_, index) => 
        setTimeout(() => {
          setVisiblePanels(prev => {
            const newState = [...prev]
            newState[index] = true
            return newState
          })
        }, 300 + index * 80)
      )

      return () => timers.forEach(timer => clearTimeout(timer))
    }
  }, [isReady, totalPanels])

  return visiblePanels
}
