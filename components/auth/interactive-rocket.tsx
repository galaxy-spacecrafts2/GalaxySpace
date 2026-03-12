"use client"

import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

interface InteractiveRocketProps {
  isPasswordFocused?: boolean
  isLoading?: boolean
  onTakeoffComplete?: () => void
}

export function InteractiveRocket({
  isPasswordFocused = false,
  isLoading = false,
  onTakeoffComplete,
}: InteractiveRocketProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isTakingOff, setIsTakingOff] = useState(false)
  const [showFlameParticles, setShowFlameParticles] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Smooth spring physics for mouse following
  const springConfig = { stiffness: 150, damping: 15 }
  const mouseX = useSpring(0, springConfig)
  const mouseY = useSpring(0, springConfig)

  // Transform mouse position to rotation
  const rotateX = useTransform(mouseY, [-200, 200], [15, -15])
  const rotateY = useTransform(mouseX, [-200, 200], [-15, 15])

  // Floating animation
  const [floatY, setFloatY] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFloatY(Math.sin(Date.now() / 1000) * 8)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && !isPasswordFocused && !isTakingOff) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        mouseX.set(e.clientX - centerX)
        mouseY.set(e.clientY - centerY)
        setMousePosition({ x: e.clientX - centerX, y: e.clientY - centerY })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY, isPasswordFocused, isTakingOff])

  // Trigger takeoff when loading
  useEffect(() => {
    if (isLoading && !isTakingOff) {
      setShowFlameParticles(true)
      setTimeout(() => {
        setIsTakingOff(true)
      }, 500)
    }
  }, [isLoading, isTakingOff])

  // Handle takeoff complete
  useEffect(() => {
    if (isTakingOff) {
      const timeout = setTimeout(() => {
        onTakeoffComplete?.()
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [isTakingOff, onTakeoffComplete])

  return (
    <div ref={containerRef} className="relative w-40 h-48">
      <motion.div
        className="relative"
        style={{
          rotateX: isPasswordFocused ? 0 : rotateX,
          rotateY: isPasswordFocused ? 0 : rotateY,
          y: isTakingOff ? 0 : floatY,
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
        animate={
          isTakingOff
            ? { y: -800, scale: 1.5, opacity: 0 }
            : isPasswordFocused
              ? { rotateZ: -30, x: 40 }
              : { rotateZ: 0, x: 0 }
        }
        transition={
          isTakingOff
            ? { duration: 1.5, ease: [0.4, 0, 0.2, 1] }
            : { type: 'spring', stiffness: 100, damping: 10 }
        }
      >
        {/* Rocket SVG - Black and White Theme */}
        <svg
          width="160"
          height="200"
          viewBox="0 0 160 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          {/* Glow effect */}
          <defs>
            <filter id="rocket-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Grayscale gradients */}
            <linearGradient id="body-gradient" x1="80" y1="30" x2="80" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e5e5e5" />
              <stop offset="100%" stopColor="#a3a3a3" />
            </linearGradient>
            <linearGradient id="nose-gradient" x1="80" y1="0" x2="80" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#404040" />
              <stop offset="100%" stopColor="#171717" />
            </linearGradient>
            <linearGradient id="fin-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#737373" />
              <stop offset="100%" stopColor="#404040" />
            </linearGradient>
            <linearGradient id="window-gradient" x1="80" y1="60" x2="80" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#525252" />
              <stop offset="100%" stopColor="#262626" />
            </linearGradient>
          </defs>

          {/* Left fin */}
          <motion.path
            d="M35 140 L20 175 L50 155 Z"
            fill="url(#fin-gradient)"
            filter="url(#rocket-glow)"
          />

          {/* Right fin */}
          <motion.path
            d="M125 140 L140 175 L110 155 Z"
            fill="url(#fin-gradient)"
            filter="url(#rocket-glow)"
          />

          {/* Center fin */}
          <path
            d="M70 155 L80 185 L90 155 Z"
            fill="url(#fin-gradient)"
          />

          {/* Main body */}
          <path
            d="M50 50 C50 30 110 30 110 50 L115 150 C115 160 45 160 45 150 Z"
            fill="url(#body-gradient)"
          />

          {/* Body details - stripes */}
          <rect x="48" y="130" width="64" height="4" fill="#737373" rx="2" />
          <rect x="48" y="140" width="64" height="4" fill="#737373" rx="2" />

          {/* Nose cone */}
          <path
            d="M50 50 C50 30 80 5 80 5 C80 5 110 30 110 50 Z"
            fill="url(#nose-gradient)"
          />

          {/* Window frame */}
          <circle cx="80" cy="80" r="22" fill="#171717" />
          
          {/* Window glass */}
          <motion.circle
            cx="80"
            cy="80"
            r="18"
            fill="url(#window-gradient)"
            animate={isPasswordFocused ? { opacity: 0.3 } : { opacity: 1 }}
          />

          {/* Window highlight */}
          <ellipse cx="74" cy="74" rx="6" ry="8" fill="rgba(255,255,255,0.2)" />

          {/* Window cover (when password focused) */}
          <AnimatePresence>
            {isPasswordFocused && (
              <motion.g
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {/* Blast shield - grayscale */}
                <rect x="60" y="60" width="40" height="40" rx="4" fill="#404040" />
                <rect x="62" y="62" width="36" height="8" rx="2" fill="#525252" />
                <rect x="62" y="72" width="36" height="8" rx="2" fill="#525252" />
                <rect x="62" y="82" width="36" height="8" rx="2" fill="#525252" />
                <rect x="62" y="92" width="36" height="4" rx="2" fill="#525252" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Rivets/details */}
          {[45, 55, 65, 105, 115, 125].map((y, i) => (
            <circle key={i} cx={i < 3 ? 52 : 108} cy={y + 60} r="2" fill="#737373" />
          ))}

          {/* Engine nozzle */}
          <ellipse cx="80" cy="160" rx="20" ry="8" fill="#404040" />
          <ellipse cx="80" cy="160" rx="15" ry="6" fill="#171717" />
        </svg>

        {/* Flame effect - grayscale with white core */}
        <AnimatePresence>
          {(isLoading || isTakingOff) && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: '155px' }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
            >
              <svg width="60" height="80" viewBox="0 0 60 80" className="overflow-visible">
                <defs>
                  <linearGradient id="flame-gradient-bw" x1="30" y1="0" x2="30" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#d4d4d4" />
                    <stop offset="70%" stopColor="#737373" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <filter id="flame-glow-bw">
                    <feGaussianBlur stdDeviation="5" />
                  </filter>
                </defs>

                {/* Outer glow */}
                <motion.ellipse
                  cx="30"
                  cy="40"
                  rx="25"
                  ry="35"
                  fill="rgba(255, 255, 255, 0.2)"
                  filter="url(#flame-glow-bw)"
                  animate={{
                    ry: [35, 45, 35],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                />

                {/* Main flame */}
                <motion.path
                  d="M15 0 C15 0 5 30 10 50 C15 70 30 80 30 80 C30 80 45 70 50 50 C55 30 45 0 45 0 C45 0 35 20 30 20 C25 20 15 0 15 0"
                  fill="url(#flame-gradient-bw)"
                  animate={{
                    d: [
                      "M15 0 C15 0 5 30 10 50 C15 70 30 80 30 80 C30 80 45 70 50 50 C55 30 45 0 45 0 C45 0 35 20 30 20 C25 20 15 0 15 0",
                      "M15 0 C15 0 0 35 10 55 C20 75 30 90 30 90 C30 90 40 75 50 55 C60 35 45 0 45 0 C45 0 38 25 30 25 C22 25 15 0 15 0",
                      "M15 0 C15 0 5 30 10 50 C15 70 30 80 30 80 C30 80 45 70 50 50 C55 30 45 0 45 0 C45 0 35 20 30 20 C25 20 15 0 15 0",
                    ],
                  }}
                  transition={{ duration: 0.15, repeat: Infinity }}
                />

                {/* Inner bright core */}
                <motion.ellipse
                  cx="30"
                  cy="15"
                  rx="8"
                  ry="12"
                  fill="#ffffff"
                  animate={{
                    ry: [12, 18, 12],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Flame particles - grayscale */}
      <AnimatePresence>
        {showFlameParticles && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: '50%',
                  top: '160px',
                  width: 4 + Math.random() * 6,
                  height: 4 + Math.random() * 6,
                  background: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#d4d4d4' : '#a3a3a3',
                }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 80,
                  y: 50 + Math.random() * 100,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.5,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 0.3,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
