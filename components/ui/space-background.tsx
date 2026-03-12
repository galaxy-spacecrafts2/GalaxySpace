"use client"

import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

// ============================================
// METEOR EFFECT - Faint diagonal streaks
// ============================================

interface MeteorProps {
  count?: number
}

export function Meteors({ count = 20 }: MeteorProps) {
  const [meteors, setMeteors] = useState<Array<{ id: number; style: React.CSSProperties }>>([])

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
      } as React.CSSProperties,
    }))
    setMeteors(generated)
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute w-0.5 h-0.5 rotate-[215deg] animate-meteor rounded-full bg-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
          style={meteor.style}
        >
          <span className="absolute top-1/2 -translate-y-1/2 w-[80px] h-[1px] bg-gradient-to-r from-white/30 to-transparent" />
        </span>
      ))}
    </div>
  )
}

// ============================================
// BACKGROUND BEAMS - SVG Snake animations
// ============================================

interface BackgroundBeamsProps {
  className?: string
}

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
    "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
    "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
    "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
  ]

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="beam-gradient-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgb(255, 255, 255)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="beam-gradient-purple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgb(200, 200, 200)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id="glow-cyan">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-purple">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base paths - very faint */}
        {paths.map((path, i) => (
          <path
            key={`base-${i}`}
            d={path}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
            fill="none"
          />
        ))}

        {/* Animated beams */}
        {paths.map((path, i) => (
          <motion.path
            key={`beam-${i}`}
            d={path}
            stroke={i % 2 === 0 ? "url(#beam-gradient-cyan)" : "url(#beam-gradient-purple)"}
            strokeWidth="2"
            fill="none"
            filter={i % 2 === 0 ? "url(#glow-cyan)" : "url(#glow-purple)"}
            strokeDasharray="50 200"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -250 }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.3,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// ============================================
// BORDER SNAKE BEAMS - Wraps around elements
// ============================================

interface BorderSnakeBeamProps {
  className?: string
  children: React.ReactNode
  beamColor?: 'cyan' | 'purple' | 'mixed'
  duration?: number
}

export function BorderSnakeBeam({ 
  children, 
  className,
  beamColor = 'mixed',
  duration = 8,
}: BorderSnakeBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })
    }
  }, [])

  const perimeter = 2 * (dimensions.width + dimensions.height)
  const dashLength = perimeter * 0.15
  const gapLength = perimeter * 0.85

  const getGradient = () => {
    switch (beamColor) {
      case 'cyan':
        return 'url(#snake-cyan)'
      case 'purple':
        return 'url(#snake-purple)'
      default:
        return 'url(#snake-mixed)'
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {dimensions.width > 0 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="snake-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="rgb(255, 255, 255)" />
              <stop offset="70%" stopColor="rgb(255, 255, 255)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="snake-purple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="rgb(200, 200, 200)" />
              <stop offset="70%" stopColor="rgb(200, 200, 200)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="snake-mixed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(255, 255, 255)" />
              <stop offset="50%" stopColor="rgb(200, 200, 200)" />
              <stop offset="100%" stopColor="rgb(255, 255, 255)" />
            </linearGradient>
            <filter id="snake-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base border */}
          <rect
            x="0.5"
            y="0.5"
            width={dimensions.width - 1}
            height={dimensions.height - 1}
            rx="8"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* Animated snake beam */}
          <motion.rect
            x="0.5"
            y="0.5"
            width={dimensions.width - 1}
            height={dimensions.height - 1}
            rx="8"
            fill="none"
            stroke={getGradient()}
            strokeWidth="2"
            filter="url(#snake-glow)"
            strokeDasharray={`${dashLength} ${gapLength}`}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -perimeter }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </svg>
      )}
      {children}
    </div>
  )
}

// ============================================
// SPACE BACKGROUND WRAPPER - Reusable layout
// ============================================

interface SpaceBackgroundProps {
  children: React.ReactNode
  showMeteors?: boolean
  showBeams?: boolean
  className?: string
}

export function SpaceBackground({ 
  children, 
  showMeteors = true,
  showBeams = true,
  className,
}: SpaceBackgroundProps) {
  return (
    <div className={`relative min-h-screen overflow-hidden bg-black ${className}`}>
      {/* Deep space gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(40, 40, 40, 0.2) 0%, rgba(0, 0, 0, 1) 70%)',
        }}
      />

      {/* Stars layer */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Meteors */}
      {showMeteors && <Meteors count={15} />}

      {/* Background beams */}
      {showBeams && <BackgroundBeams />}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
