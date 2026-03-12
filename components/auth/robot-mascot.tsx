"use client"

import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface RobotMascotProps {
  emailValue?: string
  focusedField?: 'email' | 'password' | null
  isSuccess?: boolean
  isError?: boolean
  isLoading?: boolean
}

export function RobotMascot({
  emailValue = '',
  focusedField,
  isSuccess = false,
  isError = false,
  isLoading = false,
}: RobotMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isBlinking, setIsBlinking] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  
  // Spring animations for smooth eye tracking
  const eyeX = useSpring(0, { stiffness: 150, damping: 15 })
  const eyeY = useSpring(0, { stiffness: 150, damping: 15 })
  
  // Calculate eye position based on email length (0-100)
  const emailProgress = Math.min(emailValue.length * 4, 100)
  const lookX = useTransform(() => (emailProgress / 100) * 15 - 7.5)
  
  // Handle mouse movement for eye tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && focusedField !== 'password') {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const deltaX = (e.clientX - centerX) / 50
        const deltaY = (e.clientY - centerY) / 50
        
        setMousePosition({
          x: Math.max(-8, Math.min(8, deltaX)),
          y: Math.max(-5, Math.min(5, deltaY)),
        })
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [focusedField])
  
  // Update eye position based on focus and mouse
  useEffect(() => {
    if (focusedField === 'email') {
      eyeX.set(lookX.get())
      eyeY.set(2)
    } else if (focusedField === 'password') {
      eyeX.set(0)
      eyeY.set(0)
    } else {
      eyeX.set(mousePosition.x)
      eyeY.set(mousePosition.y)
    }
  }, [focusedField, mousePosition, emailValue, eyeX, eyeY, lookX])
  
  // Random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7 && focusedField !== 'password') {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)
      }
    }, 2000)
    
    return () => clearInterval(blinkInterval)
  }, [focusedField])
  
  // Success animation with hearts
  useEffect(() => {
    if (isSuccess) {
      setShowHearts(true)
      setTimeout(() => setShowHearts(false), 2000)
    }
  }, [isSuccess])

  const isHidingEyes = focusedField === 'password'

  return (
    <div ref={containerRef} className="relative w-48 h-56 select-none">
      {/* Glow effect behind robot */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: isSuccess ? [1, 1.2, 1] : [1, 1.05, 1],
          opacity: isSuccess ? [0.3, 0.6, 0.3] : [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Main Robot SVG */}
      <motion.svg
        viewBox="0 0 200 240"
        className="w-full h-full"
        animate={{
          y: isLoading ? [0, -5, 0] : [0, -3, 0],
        }}
        transition={{
          duration: isLoading ? 0.5 : 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <defs>
          {/* Gradients - Black and White theme */}
          <linearGradient id="robotBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#404040" />
            <stop offset="50%" stopColor="#262626" />
            <stop offset="100%" stopColor="#171717" />
          </linearGradient>
          <linearGradient id="robotHead" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#525252" />
            <stop offset="100%" stopColor="#262626" />
          </linearGradient>
          <linearGradient id="robotFace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          <linearGradient id="robotEye" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e5e5e5" />
          </linearGradient>
          <linearGradient id="robotHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="robotGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="innerShadow">
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
            <feBlend mode="normal" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Antenna */}
        <motion.g
          animate={{
            rotate: isSuccess ? [0, -10, 10, -10, 0] : isError ? [0, -5, 5, -5, 0] : [0, 2, -2, 0],
          }}
          transition={{
            duration: isSuccess || isError ? 0.5 : 3,
            repeat: isSuccess || isError ? 0 : Infinity,
          }}
          style={{ transformOrigin: '100px 45px' }}
        >
          <line x1="100" y1="45" x2="100" y2="20" stroke="#525252" strokeWidth="4" strokeLinecap="round" />
          <motion.circle
            cx="100"
            cy="15"
            r={8}
            fill="#404040"
            stroke="#525252"
            strokeWidth="2"
            animate={{
              fill: isSuccess ? ['#404040', '#ffffff', '#404040'] : isLoading ? ['#404040', '#737373', '#404040'] : '#404040',
            }}
            transition={{ duration: 0.5, repeat: isLoading ? Infinity : 0 }}
          />
          {/* Antenna glow */}
          <motion.circle
            cx="100"
            cy="15"
            r={12}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.3"
            animate={{
              r: [12, 16, 12],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.g>

        {/* Head */}
        <motion.rect
          x="45"
          y="45"
          width="110"
          height="85"
          rx="25"
          fill="url(#robotHead)"
          stroke="#525252"
          strokeWidth="2"
          filter="url(#innerShadow)"
          animate={{
            y: isHidingEyes ? 48 : 45,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
        
        {/* Head highlight */}
        <rect x="50" y="50" width="100" height="30" rx="15" fill="url(#robotHighlight)" />

        {/* Face screen */}
        <rect
          x="55"
          y="55"
          width="90"
          height="65"
          rx="15"
          fill="url(#robotFace)"
          stroke="#333333"
          strokeWidth="1"
        />

        {/* Eyes container */}
        <g>
          {/* Left Eye */}
          <motion.g
            animate={{
              y: isHidingEyes ? 30 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <ellipse cx="80" cy="82" rx="15" ry={isBlinking ? 2 : 12} fill="url(#robotEye)" filter="url(#robotGlow)" />
            {!isBlinking && !isHidingEyes && (
              <motion.circle
                cx="80"
                cy="82"
                r={5}
                fill="#171717"
                style={{
                  x: eyeX,
                  y: eyeY,
                }}
              />
            )}
            {!isBlinking && !isHidingEyes && (
              <motion.circle
                cx="77"
                cy="79"
                r={2}
                fill="#ffffff"
                opacity="0.8"
                style={{
                  x: eyeX,
                  y: eyeY,
                }}
              />
            )}
          </motion.g>

          {/* Right Eye */}
          <motion.g
            animate={{
              y: isHidingEyes ? 30 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <ellipse cx="120" cy="82" rx="15" ry={isBlinking ? 2 : 12} fill="url(#robotEye)" filter="url(#robotGlow)" />
            {!isBlinking && !isHidingEyes && (
              <motion.circle
                cx="120"
                cy="82"
                r={5}
                fill="#171717"
                style={{
                  x: eyeX,
                  y: eyeY,
                }}
              />
            )}
            {!isBlinking && !isHidingEyes && (
              <motion.circle
                cx="117"
                cy="79"
                r={2}
                fill="#ffffff"
                opacity="0.8"
                style={{
                  x: eyeX,
                  y: eyeY,
                }}
              />
            )}
          </motion.g>
        </g>

        {/* Hands covering eyes when password focused */}
        <AnimatePresence>
          {isHidingEyes && (
            <>
              {/* Left hand */}
              <motion.g
                initial={{ x: -60, y: 50, rotate: 45 }}
                animate={{ x: 0, y: 0, rotate: 0 }}
                exit={{ x: -60, y: 50, rotate: 45 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <ellipse cx="70" cy="85" rx="22" ry="18" fill="#404040" stroke="#525252" strokeWidth="2" />
                <ellipse cx="70" cy="85" rx="18" ry="14" fill="#333333" />
              </motion.g>
              
              {/* Right hand */}
              <motion.g
                initial={{ x: 60, y: 50, rotate: -45 }}
                animate={{ x: 0, y: 0, rotate: 0 }}
                exit={{ x: 60, y: 50, rotate: -45 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <ellipse cx="130" cy="85" rx="22" ry="18" fill="#404040" stroke="#525252" strokeWidth="2" />
                <ellipse cx="130" cy="85" rx="18" ry="14" fill="#333333" />
              </motion.g>
            </>
          )}
        </AnimatePresence>

        {/* Mouth - changes based on state */}
        <motion.path
          d={
            isSuccess
              ? 'M 75 105 Q 100 120 125 105' // Happy smile
              : isError
              ? 'M 75 110 Q 100 100 125 110' // Sad
              : isLoading
              ? 'M 85 107 L 115 107' // Neutral line
              : 'M 80 105 Q 100 115 120 105' // Slight smile
          }
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          filter="url(#robotGlow)"
          animate={{
            d: isSuccess
              ? 'M 75 105 Q 100 125 125 105'
              : isError
              ? 'M 75 112 Q 100 100 125 112'
              : isLoading
              ? ['M 85 107 L 115 107', 'M 85 105 Q 100 112 115 105', 'M 85 107 L 115 107']
              : 'M 80 105 Q 100 115 120 105',
          }}
          transition={{
            duration: isLoading ? 1 : 0.3,
            repeat: isLoading ? Infinity : 0,
          }}
        />

        {/* Cheek blush when success */}
        <AnimatePresence>
          {isSuccess && (
            <>
              <motion.ellipse
                cx="55"
                cy="95"
                rx="8"
                ry="5"
                fill="#ffffff"
                opacity="0.2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.2, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              />
              <motion.ellipse
                cx="145"
                cy="95"
                rx="8"
                ry="5"
                fill="#ffffff"
                opacity="0.2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.2, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Body */}
        <motion.rect
          x="55"
          y="135"
          width="90"
          height="70"
          rx="20"
          fill="url(#robotBody)"
          stroke="#525252"
          strokeWidth="2"
          filter="url(#innerShadow)"
        />
        
        {/* Body highlight */}
        <rect x="60" y="140" width="80" height="25" rx="12" fill="url(#robotHighlight)" />

        {/* Chest panel */}
        <rect x="70" y="150" width="60" height="40" rx="8" fill="#1a1a1a" stroke="#333333" strokeWidth="1" />
        
        {/* Chest lights */}
        <motion.circle
            cx="85"
            cy="165"
            r={5}
            fill="#404040"
            animate={{
              fill: isSuccess ? ['#404040', '#ffffff', '#404040'] : ['#404040', '#525252', '#404040'],
            }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
        <motion.circle
          cx="100"
          cy="165"
          r={5}
          fill="#404040"
          animate={{
            fill: isLoading ? ['#404040', '#ffffff', '#404040'] : ['#404040', '#525252', '#404040'],
          }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle
          cx="115"
          cy="165"
          r={5}
          fill="#404040"
          animate={{
            fill: isSuccess ? ['#404040', '#ffffff', '#404040'] : ['#404040', '#525252', '#404040'],
          }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
        />

        {/* Arms */}
        {!isHidingEyes && (
          <>
            {/* Left arm */}
            <motion.g
              animate={{
                rotate: isSuccess ? [0, -15, 0] : [0, -3, 0],
              }}
              transition={{
                duration: isSuccess ? 0.3 : 2,
                repeat: isSuccess ? 2 : Infinity,
              }}
              style={{ transformOrigin: '55px 150px' }}
            >
              <rect x="25" y="145" width="35" height="18" rx="9" fill="#404040" stroke="#525252" strokeWidth="2" />
              <circle cx="25" cy="154" r={12} fill="#333333" stroke="#404040" strokeWidth="2" />
            </motion.g>

            {/* Right arm */}
            <motion.g
              animate={{
                rotate: isSuccess ? [0, 15, 0] : [0, 3, 0],
              }}
              transition={{
                duration: isSuccess ? 0.3 : 2,
                repeat: isSuccess ? 2 : Infinity,
                delay: 0.1,
              }}
              style={{ transformOrigin: '145px 150px' }}
            >
              <rect x="140" y="145" width="35" height="18" rx="9" fill="#404040" stroke="#525252" strokeWidth="2" />
              <circle cx="175" cy="154" r={12} fill="#333333" stroke="#404040" strokeWidth="2" />
            </motion.g>
          </>
        )}

        {/* Feet */}
        <ellipse cx="75" cy="215" rx="20" ry="8" fill="#333333" stroke="#404040" strokeWidth="2" />
        <ellipse cx="125" cy="215" rx="20" ry="8" fill="#333333" stroke="#404040" strokeWidth="2" />
      </motion.svg>

      {/* Hearts animation on success */}
      <AnimatePresence>
        {showHearts && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: 80 + i * 20,
                  y: 50,
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0.8],
                  y: [50, -20, -40],
                  x: 80 + i * 20 + (i - 1) * 30,
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.2,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Error shake particles */}
      <AnimatePresence>
        {isError && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/50 rounded-full"
                initial={{ 
                  opacity: 0,
                  x: 96,
                  y: 100,
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  x: 96 + (Math.random() - 0.5) * 100,
                  y: 100 + (Math.random() - 0.5) * 60,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
