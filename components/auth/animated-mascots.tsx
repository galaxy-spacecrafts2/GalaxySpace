"use client"

import { motion, AnimatePresence } from 'framer-motion'

type MascotState = 'idle' | 'watching' | 'covering' | 'happy' | 'celebrating'

interface AnimatedMascotsProps {
  state: MascotState
  side: 'left' | 'right'
}

// Cute astronaut mascot component
export function AnimatedMascot({ state, side }: AnimatedMascotsProps) {
  const isLeft = side === 'left'
  
  // Eye positions based on state
  const getEyeState = () => {
    switch (state) {
      case 'covering':
        return { scale: 0, y: 0 }
      case 'happy':
      case 'celebrating':
        return { scale: 1, y: 2 } // Eyes squint when happy (moved down)
      default:
        return { scale: 1, y: 0 }
    }
  }

  const eyeState = getEyeState()

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: state === 'celebrating' ? [0, -10, 0] : 0,
      }}
      transition={{ 
        duration: 0.5,
        y: state === 'celebrating' ? { duration: 0.5, repeat: Infinity, repeatType: 'reverse' } : undefined
      }}
    >
      {/* Astronaut body */}
      <svg 
        width="120" 
        height="140" 
        viewBox="0 0 120 140" 
        className="drop-shadow-lg"
      >
        {/* Helmet glow */}
        <motion.ellipse
          cx="60"
          cy="50"
          rx="48"
          ry="48"
          fill="url(#helmetGlow)"
          animate={{ 
            opacity: state === 'celebrating' ? [0.3, 0.6, 0.3] : 0.2,
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Helmet */}
        <motion.ellipse
          cx="60"
          cy="50"
          rx="42"
          ry="42"
          className="fill-card stroke-border"
          strokeWidth="3"
          animate={{
            scale: state === 'happy' || state === 'celebrating' ? 1.02 : 1,
          }}
        />
        
        {/* Visor */}
        <ellipse
          cx="60"
          cy="52"
          rx="32"
          ry="28"
          className="fill-background/80"
        />
        
        {/* Visor reflection */}
        <ellipse
          cx="50"
          cy="42"
          rx="8"
          ry="5"
          className="fill-foreground/10"
        />
        
        {/* Left Eye */}
        <motion.g
          animate={{
            scale: eyeState.scale,
            y: eyeState.y,
          }}
          transition={{ duration: 0.2 }}
        >
          <ellipse
            cx="48"
            cy="50"
            rx="8"
            ry={state === 'happy' || state === 'celebrating' ? 3 : 8}
            className="fill-foreground"
          />
          {/* Pupil */}
          {state !== 'happy' && state !== 'celebrating' && (
            <motion.ellipse
              cx="50"
              cy="50"
              rx="3"
              ry="3"
              className="fill-primary"
              animate={{
                cx: state === 'watching' ? (isLeft ? 52 : 48) : 50,
              }}
            />
          )}
        </motion.g>
        
        {/* Right Eye */}
        <motion.g
          animate={{
            scale: eyeState.scale,
            y: eyeState.y,
          }}
          transition={{ duration: 0.2 }}
        >
          <ellipse
            cx="72"
            cy="50"
            rx="8"
            ry={state === 'happy' || state === 'celebrating' ? 3 : 8}
            className="fill-foreground"
          />
          {/* Pupil */}
          {state !== 'happy' && state !== 'celebrating' && (
            <motion.ellipse
              cx="74"
              cy="50"
              rx="3"
              ry="3"
              className="fill-primary"
              animate={{
                cx: state === 'watching' ? (isLeft ? 76 : 72) : 74,
              }}
            />
          )}
        </motion.g>
        
        {/* Hands covering eyes */}
        <AnimatePresence>
          {state === 'covering' && (
            <>
              <motion.ellipse
                cx="45"
                cy="50"
                rx="14"
                ry="10"
                className="fill-card stroke-border"
                strokeWidth="2"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.ellipse
                cx="75"
                cy="50"
                rx="14"
                ry="10"
                className="fill-card stroke-border"
                strokeWidth="2"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 30, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </>
          )}
        </AnimatePresence>
        
        {/* Mouth */}
        <motion.path
          d={state === 'happy' || state === 'celebrating' 
            ? "M 50 65 Q 60 75 70 65" 
            : "M 52 65 Q 60 68 68 65"
          }
          fill="none"
          className="stroke-foreground"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            d: state === 'happy' || state === 'celebrating' 
              ? "M 50 65 Q 60 80 70 65" 
              : "M 52 65 Q 60 68 68 65"
          }}
        />
        
        {/* Blush when happy */}
        <AnimatePresence>
          {(state === 'happy' || state === 'celebrating') && (
            <>
              <motion.ellipse
                cx="38"
                cy="58"
                rx="6"
                ry="3"
                className="fill-primary/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.ellipse
                cx="82"
                cy="58"
                rx="6"
                ry="3"
                className="fill-primary/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </>
          )}
        </AnimatePresence>
        
        {/* Body */}
        <motion.path
          d="M 30 92 Q 30 85 40 82 L 60 80 L 80 82 Q 90 85 90 92 L 90 130 Q 90 140 80 140 L 40 140 Q 30 140 30 130 Z"
          className="fill-card stroke-border"
          strokeWidth="3"
        />
        
        {/* Body detail line */}
        <line x1="60" y1="85" x2="60" y2="135" className="stroke-border" strokeWidth="2" />
        
        {/* Antenna */}
        <motion.g
          animate={{
            rotate: state === 'celebrating' ? [0, 10, -10, 0] : 0,
          }}
          transition={{ duration: 0.5, repeat: state === 'celebrating' ? Infinity : 0 }}
          style={{ transformOrigin: '60px 8px' }}
        >
          <line x1="60" y1="8" x2="60" y2="20" className="stroke-border" strokeWidth="3" />
          <motion.circle
            cx="60"
            cy="5"
            r="5"
            className="fill-primary"
            animate={{
              scale: state === 'celebrating' ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.5, repeat: state === 'celebrating' ? Infinity : 0 }}
          />
        </motion.g>
        
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="helmetGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" className="text-primary" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" className="text-primary" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Celebration particles */}
      <AnimatePresence>
        {state === 'celebrating' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary"
                style={{
                  left: '50%',
                  top: '20%',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos((i / 6) * Math.PI * 2) * 40,
                  y: Math.sin((i / 6) * Math.PI * 2) * 40 - 20,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface MascotContainerProps {
  state: MascotState
}

export function MascotContainer({ state }: MascotContainerProps) {
  return (
    <div className="hidden lg:flex absolute inset-0 pointer-events-none">
      {/* Left mascot */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2">
        <AnimatedMascot state={state} side="left" />
      </div>
      
      {/* Right mascot */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 scale-x-[-1]">
        <AnimatedMascot state={state} side="right" />
      </div>
    </div>
  )
}
