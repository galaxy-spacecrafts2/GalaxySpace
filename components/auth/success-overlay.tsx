"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, CheckCircle2 } from 'lucide-react'

interface SuccessOverlayProps {
  isVisible: boolean
  message: string
  onComplete?: () => void
}

export function SuccessOverlay({ isVisible, message, onComplete }: SuccessOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => {
            if (isVisible) {
              setTimeout(() => {
                onComplete?.()
              }, 2000)
            }
          }}
        >
          {/* Animated background circles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-primary/20"
                style={{
                  left: '50%',
                  top: '50%',
                  translateX: '-50%',
                  translateY: '-50%',
                }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ 
                  width: 200 + i * 150, 
                  height: 200 + i * 150, 
                  opacity: [0, 0.5, 0] 
                }}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.2, 
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {/* Success icon with rocket */}
            <motion.div
              className="relative mb-8"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <motion.div
                className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Rocket className="w-12 h-12 text-primary" />
                </motion.div>
              </motion.div>
              
              {/* Check mark */}
              <motion.div
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
              >
                <CheckCircle2 className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>

            {/* Message */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {message}
            </motion.h1>

            {/* Loading indicator */}
            <motion.div
              className="flex items-center gap-3 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="text-sm text-muted-foreground font-mono">Preparing mission control</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Animated progress bar */}
            <motion.div
              className="w-64 h-1 bg-secondary rounded-full mt-6 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>

          {/* Floating stars */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/50 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
