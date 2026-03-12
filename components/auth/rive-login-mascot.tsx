"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// State machine inputs interface
interface MascotInputs {
  isChecking: boolean
  isHandsUp: boolean
  lookProgress: number // 0-100
  trigSuccess: boolean
  trigFail: boolean
}

interface RiveLoginMascotProps {
  emailValue: string
  focusedField: 'email' | 'password' | null
  isSuccess?: boolean
  isError?: boolean
  className?: string
}

// Custom SVG-based animated mascot that mimics Rive behavior
// Since Rive requires a .riv file, we create a fully interactive SVG mascot
export function RiveLoginMascot({
  emailValue,
  focusedField,
  isSuccess = false,
  isError = false,
  className,
}: RiveLoginMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })
  const [blinkState, setBlinkState] = useState(false)

  // Calculate look progress based on email length (0-100)
  const lookProgress = Math.min((emailValue.length / 30) * 100, 100)
  
  // Map look progress to eye X position (-15 to 15)
  const eyeX = (lookProgress / 100) * 30 - 15

  // Determine mascot state
  const isWatching = focusedField === 'email'
  const isHandsUp = focusedField === 'password'
  const isCelebrating = isSuccess
  const isSad = isError

  // Random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (!isHandsUp && !isCelebrating) {
        setBlinkState(true)
        setTimeout(() => setBlinkState(false), 150)
      }
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(blinkInterval)
  }, [isHandsUp, isCelebrating])

  // Update eye position when watching
  useEffect(() => {
    if (isWatching) {
      setEyePosition({ x: eyeX, y: 2 })
    } else {
      setEyePosition({ x: 0, y: 0 })
    }
  }, [isWatching, eyeX])

  return (
    <div ref={containerRef} className={className}>
      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="drop-shadow-2xl"
        animate={isCelebrating ? { y: [0, -10, 0] } : {}}
        transition={isCelebrating ? { duration: 0.5, repeat: Infinity } : {}}
      >
        {/* Glow effect */}
        <defs>
          <radialGradient id="mascot-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
          </radialGradient>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <motion.circle
          cx="100"
          cy="90"
          r="85"
          fill="url(#mascot-glow)"
          animate={{ 
            opacity: isCelebrating ? [0.3, 0.6, 0.3] : 0.2,
            scale: isCelebrating ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Helmet (head) */}
        <motion.circle
          cx="100"
          cy="85"
          r="65"
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth="3"
          animate={{ 
            scale: isCelebrating ? 1.02 : isSad ? 0.98 : 1 
          }}
        />

        {/* Visor (face area) */}
        <ellipse
          cx="100"
          cy="90"
          rx="50"
          ry="45"
          fill="hsl(var(--background))"
          opacity="0.9"
        />

        {/* Visor reflection */}
        <ellipse
          cx="80"
          cy="70"
          rx="15"
          ry="8"
          fill="hsl(var(--foreground))"
          opacity="0.1"
        />

        {/* Eyes group */}
        <g>
          {/* Left eye white */}
          <AnimatePresence mode="wait">
            {!isHandsUp && (
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <ellipse
                  cx="80"
                  cy="85"
                  rx="12"
                  ry={blinkState || isCelebrating ? 2 : 12}
                  fill="hsl(var(--foreground))"
                />
                {/* Left pupil */}
                {!blinkState && !isCelebrating && (
                  <motion.circle
                    cx="80"
                    cy="85"
                    r="5"
                    fill="hsl(var(--primary))"
                    animate={{ 
                      cx: 80 + eyePosition.x * 0.3,
                      cy: 85 + eyePosition.y
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Right eye white */}
          <AnimatePresence mode="wait">
            {!isHandsUp && (
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <ellipse
                  cx="120"
                  cy="85"
                  rx="12"
                  ry={blinkState || isCelebrating ? 2 : 12}
                  fill="hsl(var(--foreground))"
                />
                {/* Right pupil */}
                {!blinkState && !isCelebrating && (
                  <motion.circle
                    cx="120"
                    cy="85"
                    r="5"
                    fill="hsl(var(--primary))"
                    animate={{ 
                      cx: 120 + eyePosition.x * 0.3,
                      cy: 85 + eyePosition.y
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.g>
            )}
          </AnimatePresence>
        </g>

        {/* Hands covering eyes animation */}
        <AnimatePresence>
          {isHandsUp && (
            <>
              {/* Left hand */}
              <motion.ellipse
                cx="75"
                cy="85"
                rx="22"
                ry="16"
                fill="hsl(var(--card))"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                initial={{ x: -60, opacity: 0, rotate: -20 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                exit={{ x: -60, opacity: 0, rotate: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              />
              {/* Left hand fingers */}
              {[0, 1, 2].map((i) => (
                <motion.ellipse
                  key={`left-finger-${i}`}
                  cx={65 + i * 10}
                  cy={72}
                  rx="4"
                  ry="8"
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -60, opacity: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: i * 0.05 
                  }}
                />
              ))}

              {/* Right hand */}
              <motion.ellipse
                cx="125"
                cy="85"
                rx="22"
                ry="16"
                fill="hsl(var(--card))"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                initial={{ x: 60, opacity: 0, rotate: 20 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                exit={{ x: 60, opacity: 0, rotate: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              />
              {/* Right hand fingers */}
              {[0, 1, 2].map((i) => (
                <motion.ellipse
                  key={`right-finger-${i}`}
                  cx={115 + i * 10}
                  cy={72}
                  rx="4"
                  ry="8"
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 60, opacity: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: i * 0.05 
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Mouth */}
        <motion.path
          d={
            isCelebrating
              ? "M 80 110 Q 100 130 120 110"
              : isSad
              ? "M 85 115 Q 100 105 115 115"
              : isWatching
              ? "M 90 110 Q 100 115 110 110"
              : "M 90 108 Q 100 112 110 108"
          }
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Blush when happy */}
        <AnimatePresence>
          {isCelebrating && (
            <>
              <motion.ellipse
                cx="60"
                cy="100"
                rx="10"
                ry="5"
                fill="hsl(var(--primary))"
                opacity="0.3"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.3, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              />
              <motion.ellipse
                cx="140"
                cy="100"
                rx="10"
                ry="5"
                fill="hsl(var(--primary))"
                opacity="0.3"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.3, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Antenna */}
        <motion.g
          animate={isCelebrating ? { rotate: [0, 15, -15, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ transformOrigin: '100px 20px' }}
        >
          <line
            x1="100"
            y1="20"
            x2="100"
            y2="35"
            stroke="hsl(var(--border))"
            strokeWidth="3"
          />
          <motion.circle
            cx="100"
            cy="15"
            r="8"
            fill="hsl(var(--primary))"
            filter="url(#glow-filter)"
            animate={isCelebrating ? { scale: [1, 1.5, 1] } : { scale: [1, 1.1, 1] }}
            transition={{ duration: isCelebrating ? 0.3 : 2, repeat: Infinity }}
          />
        </motion.g>

        {/* Body hint */}
        <path
          d="M 60 145 Q 60 135 70 132 L 100 130 L 130 132 Q 140 135 140 145 L 140 180 Q 140 190 130 190 L 70 190 Q 60 190 60 180 Z"
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth="3"
        />
        
        {/* Body detail */}
        <line
          x1="100"
          y1="135"
          x2="100"
          y2="185"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
      </motion.svg>

      {/* Celebration particles */}
      <AnimatePresence>
        {isCelebrating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: '50%',
                  top: '30%',
                  backgroundColor: i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                }}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: Math.cos((i / 12) * Math.PI * 2) * 80,
                  y: Math.sin((i / 12) * Math.PI * 2) * 80 - 30,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Alternative: Real Rive component (requires .riv file)
// Users can replace this with actual Rive animation by uploading a .riv file
export function RiveMascotPlaceholder({
  riveFile,
  stateMachineInputs,
}: {
  riveFile?: string
  stateMachineInputs?: MascotInputs
}) {
  // This is a placeholder for when users want to use actual Rive files
  // To use:
  // 1. Create your mascot in Rive (rive.app)
  // 2. Export as .riv file
  // 3. Add to public folder
  // 4. Use @rive-app/react-canvas

  /*
  import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
  
  const { rive, RiveComponent } = useRive({
    src: riveFile,
    stateMachines: 'LoginMachine',
    autoplay: true,
  })

  const isChecking = useStateMachineInput(rive, 'LoginMachine', 'isChecking')
  const isHandsUp = useStateMachineInput(rive, 'LoginMachine', 'isHandsUp')
  const lookProgress = useStateMachineInput(rive, 'LoginMachine', 'lookProgress')

  useEffect(() => {
    if (isChecking) isChecking.value = stateMachineInputs?.isChecking ?? false
    if (isHandsUp) isHandsUp.value = stateMachineInputs?.isHandsUp ?? false
    if (lookProgress) lookProgress.value = stateMachineInputs?.lookProgress ?? 0
  }, [stateMachineInputs, isChecking, isHandsUp, lookProgress])

  return <RiveComponent />
  */

  return null
}
