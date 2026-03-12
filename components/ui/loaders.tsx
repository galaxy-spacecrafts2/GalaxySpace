"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ============================================
// 1. SKELETON SCREENS - Modern Content Loading
// ============================================

interface SkeletonCardProps {
  className?: string
  lines?: number
  showImage?: boolean
  showAvatar?: boolean
}

export function SkeletonCard({ className, lines = 3, showImage = true, showAvatar = false }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 space-y-4", className)}>
      {showImage && (
        <div className="relative overflow-hidden rounded-lg bg-muted h-40">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}
      {showAvatar && (
        <div className="flex items-center gap-3">
          <div className="relative overflow-hidden rounded-full bg-muted w-10 h-10">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <div className="relative overflow-hidden rounded bg-muted h-4 w-24">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded bg-muted h-4"
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonTelemetry({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-6 space-y-4", className)}>
      <div className="flex justify-between items-center">
        <div className="relative overflow-hidden rounded bg-muted h-6 w-32">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div className="relative overflow-hidden rounded-full bg-muted h-3 w-3">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
      <div className="relative overflow-hidden rounded bg-muted h-24">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative overflow-hidden rounded bg-muted h-12">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// 2. GEOMETRIC SPINNERS - Minimal & Modern
// ============================================

export function GeometricSpinner({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border-2 border-foreground/20 rounded-lg"
          style={{ borderTopColor: 'var(--foreground)' }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5 - i * 0.3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

export function PulsingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-foreground"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  )
}

export function MorphingSquare({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={cn("bg-foreground", className)}
      style={{ width: size, height: size }}
      animate={{
        borderRadius: ['20%', '50%', '20%'],
        rotate: [0, 180, 360],
        scale: [1, 0.8, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

export function OrbitingRings({ size = 60, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute border-2 border-transparent rounded-full"
          style={{
            width: size - i * 12,
            height: size - i * 12,
            top: i * 6,
            left: i * 6,
            borderTopColor: `rgba(255, 255, 255, ${1 - i * 0.3})`,
            borderRightColor: `rgba(255, 255, 255, ${0.5 - i * 0.15})`,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{
            duration: 1.5 + i * 0.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// 3. PROGRESS BARS - Futuristic
// ============================================

interface ProgressBarProps {
  progress?: number
  indeterminate?: boolean
  className?: string
  showPercentage?: boolean
}

export function FuturisticProgress({ progress = 0, indeterminate = false, className, showPercentage }: ProgressBarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        {indeterminate ? (
          <motion.div
            className="absolute h-full w-1/3 rounded-full bg-gradient-to-r from-foreground/50 via-foreground to-foreground/50"
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-foreground/70 to-foreground"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {showPercentage && !indeterminate && (
        <div className="text-right text-xs font-mono text-muted-foreground">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

export function SegmentedProgress({ progress = 0, segments = 10, className }: ProgressBarProps & { segments?: number }) {
  const filledSegments = Math.floor((progress / 100) * segments)
  
  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: segments }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 h-2 rounded-sm"
          initial={{ opacity: 0.2 }}
          animate={{
            opacity: i < filledSegments ? 1 : 0.2,
            backgroundColor: i < filledSegments ? 'var(--foreground)' : 'var(--muted)',
          }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        />
      ))}
    </div>
  )
}

// ============================================
// 4. BRAND LOADERS - Rocket Theme
// ============================================

export function RocketLoader({ size = 80, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size * 1.5 }}>
      {/* Rocket body */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width={size * 0.5} height={size} viewBox="0 0 40 80" fill="none">
          {/* Rocket body */}
          <path
            d="M20 0C20 0 8 20 8 45C8 55 12 65 20 70C28 65 32 55 32 45C32 20 20 0 20 0Z"
            fill="currentColor"
          />
          {/* Window */}
          <circle cx="20" cy="30" r="6" fill="var(--background)" />
          {/* Fins */}
          <path d="M8 55L0 70L8 65Z" fill="currentColor" />
          <path d="M32 55L40 70L32 65Z" fill="currentColor" />
        </svg>
      </motion.div>
      
      {/* Flame */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        animate={{
          scaleY: [0.8, 1.2, 0.8],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 0.15, repeat: Infinity }}
      >
        <svg width={size * 0.3} height={size * 0.4} viewBox="0 0 24 32">
          <motion.path
            d="M12 0C12 0 4 8 4 16C4 24 8 32 12 32C16 32 20 24 20 16C20 8 12 0 12 0Z"
            fill="url(#flameGradient)"
            animate={{ d: [
              "M12 0C12 0 4 8 4 16C4 24 8 32 12 32C16 32 20 24 20 16C20 8 12 0 12 0Z",
              "M12 0C12 0 2 10 2 18C2 26 6 32 12 32C18 32 22 26 22 18C22 10 12 0 12 0Z",
              "M12 0C12 0 4 8 4 16C4 24 8 32 12 32C16 32 20 24 20 16C20 8 12 0 12 0Z",
            ]}}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          <defs>
            <linearGradient id="flameGradient" x1="12" y1="0" x2="12" y2="32">
              <stop offset="0%" stopColor="#FFA500" />
              <stop offset="50%" stopColor="#FF4500" />
              <stop offset="100%" stopColor="#FF0000" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      
      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full bg-orange-400"
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 40,
            y: [0, 30],
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )
}

export function LogoAssembler({ className }: { className?: string }) {
  const letters = ['G', 'A', 'L', 'A', 'X', 'Y']
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="text-2xl font-bold font-mono"
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          {letter}
        </motion.span>
      ))}
      <motion.span
        className="text-2xl font-bold text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2.5 }}
      >
        .SC
      </motion.span>
    </div>
  )
}

// ============================================
// 5. GOOEY EFFECT - Viscous Blobs
// ============================================

export function GooeyLoader({ size = 60, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 60 60">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
          </filter>
        </defs>
        <g filter="url(#gooey)">
          <motion.circle
            cx="20"
            cy="30"
            r="8"
            fill="currentColor"
            animate={{ cx: [20, 40, 20] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="40"
            cy="30"
            r="8"
            fill="currentColor"
            animate={{ cx: [40, 20, 40] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      </svg>
    </div>
  )
}

export function BlobMorph({ size = 80, className }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={cn("bg-foreground", className)}
      style={{ width: size, height: size }}
      animate={{
        borderRadius: [
          '60% 40% 30% 70% / 60% 30% 70% 40%',
          '30% 60% 70% 40% / 50% 60% 30% 60%',
          '60% 40% 30% 70% / 60% 30% 70% 40%',
        ],
        rotate: [0, 360],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

// ============================================
// 6. 3D ELEMENTS - Technological
// ============================================

export function Cube3D({ size = 50, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn("relative", className)}
      style={{
        width: size,
        height: size,
        perspective: size * 3,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateX: 360, rotateY: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face, i) => {
          const transforms: Record<string, string> = {
            front: `translateZ(${size / 2}px)`,
            back: `translateZ(-${size / 2}px) rotateY(180deg)`,
            right: `translateX(${size / 2}px) rotateY(90deg)`,
            left: `translateX(-${size / 2}px) rotateY(-90deg)`,
            top: `translateY(-${size / 2}px) rotateX(90deg)`,
            bottom: `translateY(${size / 2}px) rotateX(-90deg)`,
          }
          return (
            <div
              key={face}
              className="absolute inset-0 border border-foreground/30 bg-foreground/10 backdrop-blur-sm"
              style={{ transform: transforms[face] }}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

export function Sphere3D({ size = 60, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-foreground/30"
        animate={{ rotateY: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border border-foreground/20"
        animate={{ rotateX: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-foreground/10"
        animate={{ rotateZ: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-foreground/20 to-transparent" />
    </div>
  )
}

// ============================================
// 7. MASCOT LOADER - Character Animation
// ============================================

export function AstronautLoader({ size = 100, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Helmet */}
        <circle cx="50" cy="40" r="25" fill="var(--card)" stroke="currentColor" strokeWidth="3" />
        {/* Visor */}
        <ellipse cx="50" cy="40" rx="18" ry="15" fill="var(--muted)" />
        {/* Visor reflection */}
        <motion.ellipse
          cx="45"
          cy="35"
          rx="6"
          ry="4"
          fill="white"
          opacity="0.5"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Body */}
        <rect x="35" y="60" width="30" height="30" rx="5" fill="currentColor" />
        {/* Arms */}
        <motion.rect
          x="20"
          y="65"
          width="18"
          height="8"
          rx="4"
          fill="currentColor"
          animate={{ rotate: [-10, 10, -10] }}
          style={{ originX: '100%', originY: '50%' }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.rect
          x="62"
          y="65"
          width="18"
          height="8"
          rx="4"
          fill="currentColor"
          animate={{ rotate: [10, -10, 10] }}
          style={{ originX: '0%', originY: '50%' }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        {/* Legs */}
        <rect x="38" y="85" width="8" height="12" rx="3" fill="currentColor" />
        <rect x="54" y="85" width="8" height="12" rx="3" fill="currentColor" />
      </motion.svg>
      
      {/* Floating stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-foreground rounded-full"
          style={{
            top: `${20 + i * 25}%`,
            left: `${10 + i * 35}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// 8. THEMATIC LOADERS - Action Concepts
// ============================================

export function LaunchSequence({ className }: { className?: string }) {
  const steps = ['INITIALIZING', 'CHECKING SYSTEMS', 'FUELING', 'COUNTDOWN', 'LAUNCH']
  const [currentStep, setCurrentStep] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            className="h-1 flex-1 rounded-full"
            animate={{
              backgroundColor: i <= currentStep ? 'var(--foreground)' : 'var(--muted)',
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      <motion.div
        key={currentStep}
        className="text-center font-mono text-sm tracking-wider"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        {steps[currentStep]}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          _
        </motion.span>
      </motion.div>
    </div>
  )
}

import { useState, useEffect } from 'react'

export function DataTransmission({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Satellite */}
      <div className="relative">
        <svg width="30" height="30" viewBox="0 0 30 30">
          <rect x="10" y="10" width="10" height="10" fill="currentColor" />
          <rect x="0" y="12" width="12" height="6" fill="currentColor" opacity="0.7" />
          <rect x="18" y="12" width="12" height="6" fill="currentColor" opacity="0.7" />
        </svg>
      </div>
      
      {/* Signal waves */}
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full bg-foreground"
            animate={{
              height: [4, 16, 4],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
      
      {/* Earth */}
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-green-400" />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.3) 50%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  )
}

// ============================================
// FULL PAGE LOADER - Combines Everything
// ============================================

interface FullPageLoaderProps {
  isLoading: boolean
  variant?: 'rocket' | 'astronaut' | 'minimal' | 'brand'
  message?: string
}

export function FullPageLoader({ isLoading, variant = 'rocket', message = 'Loading...' }: FullPageLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {variant === 'rocket' && <RocketLoader size={80} />}
            {variant === 'astronaut' && <AstronautLoader size={120} />}
            {variant === 'minimal' && <OrbitingRings size={60} />}
            {variant === 'brand' && <LogoAssembler />}
          </motion.div>
          
          <motion.p
            className="mt-8 font-mono text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
          
          <motion.div
            className="mt-4 w-48"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FuturisticProgress indeterminate />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// INLINE LOADERS - For buttons and small areas
// ============================================

export function ButtonLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-current"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )
}

export function SpinnerModern({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={cn("border-2 border-current border-t-transparent rounded-full", className)}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  )
}

// ============================================
// 9. GLASSMORPHISM LOADER - Tendência 2026
// ============================================

export function GlassLoader({ size = 80, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {/* Background blur effect */}
      <div 
        className="absolute inset-0 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        }}
      />
      
      {/* Animated inner glow */}
      <motion.div
        className="absolute inset-2 rounded-xl"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Orbiting elements */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/60"
          style={{
            top: '50%',
            left: '50%',
          }}
          animate={{
            x: [
              Math.cos((i * 2 * Math.PI) / 3) * (size / 3),
              Math.cos((i * 2 * Math.PI) / 3 + Math.PI) * (size / 3),
              Math.cos((i * 2 * Math.PI) / 3 + 2 * Math.PI) * (size / 3),
            ],
            y: [
              Math.sin((i * 2 * Math.PI) / 3) * (size / 3),
              Math.sin((i * 2 * Math.PI) / 3 + Math.PI) * (size / 3),
              Math.sin((i * 2 * Math.PI) / 3 + 2 * Math.PI) * (size / 3),
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

export function NeumorphicSpinner({ size = 60, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn("relative rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: 'var(--card)',
        boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.3), inset -4px -4px 8px rgba(255,255,255,0.05)',
      }}
    >
      <motion.div
        className="absolute inset-2 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent, var(--foreground), transparent)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
      <div
        className="absolute inset-3 rounded-full"
        style={{ background: 'var(--card)' }}
      />
    </div>
  )
}

// ============================================
// 10. LIQUID ANIMATION - Formas Fluidas
// ============================================

export function LiquidLoader({ size = 80, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <filter id="liquid-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10"
            />
          </filter>
        </defs>
        <g filter="url(#liquid-filter)">
          <motion.circle
            cx="35"
            cy="50"
            r="15"
            fill="currentColor"
            animate={{
              cx: [35, 65, 35],
              cy: [50, 40, 50],
              r: [15, 12, 15],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="65"
            cy="50"
            r="15"
            fill="currentColor"
            animate={{
              cx: [65, 35, 65],
              cy: [50, 60, 50],
              r: [15, 18, 15],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="50"
            cy="35"
            r="10"
            fill="currentColor"
            animate={{
              cy: [35, 65, 35],
              r: [10, 14, 10],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      </svg>
    </div>
  )
}

export function WaveLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-end gap-1 h-8", className)}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-foreground origin-bottom"
          animate={{
            scaleY: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
          style={{ height: '100%' }}
        />
      ))}
    </div>
  )
}

// ============================================
// 11. TOP PROGRESS BAR - Linha Slim
// ============================================

interface TopProgressBarProps {
  isLoading: boolean
  className?: string
}

export function TopProgressBar({ isLoading, className }: TopProgressBarProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={cn("fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden", className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-full w-1/3 bg-gradient-to-r from-foreground/50 via-foreground to-foreground/50"
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// 12. MICROCOPY CRIATIVO - Frases Temáticas
// ============================================

const SPACE_MESSAGES = [
  'Calculando trajetória orbital...',
  'Sincronizando com a estação espacial...',
  'Verificando sistemas de navegação...',
  'Preparando módulo de aterrissagem...',
  'Calibrando sensores de telemetria...',
  'Estabelecendo comunicação via satélite...',
  'Carregando dados da missão...',
  'Iniciando protocolo de lançamento...',
  'Analisando coordenadas estelares...',
  'Ativando propulsores auxiliares...',
]

export function useLoadingMessage(interval = 3000) {
  const [messageIndex, setMessageIndex] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % SPACE_MESSAGES.length)
    }, interval)
    return () => clearInterval(timer)
  }, [interval])
  
  return SPACE_MESSAGES[messageIndex]
}

interface LoadingMessageProps {
  className?: string
  interval?: number
}

export function LoadingMessage({ className, interval = 3000 }: LoadingMessageProps) {
  const message = useLoadingMessage(interval)
  
  return (
    <motion.div
      key={message}
      className={cn("font-mono text-sm text-muted-foreground", className)}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {message}
    </motion.div>
  )
}

// ============================================
// 13. ACESSIBILIDADE - Reduced Motion
// ============================================

export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  return prefersReduced
}

interface AccessibleLoaderProps {
  size?: number
  className?: string
  label?: string
}

export function AccessibleLoader({ size = 40, className, label = 'Carregando...' }: AccessibleLoaderProps) {
  const prefersReduced = useReducedMotion()
  
  if (prefersReduced) {
    // Static loader for users with reduced motion preference
    return (
      <div 
        className={cn("flex items-center gap-2", className)}
        role="status"
        aria-label={label}
      >
        <div 
          className="rounded-full border-2 border-foreground border-t-transparent"
          style={{ width: size, height: size }}
        />
        <span className="sr-only">{label}</span>
      </div>
    )
  }
  
  return (
    <div 
      className={cn("relative", className)}
      role="status"
      aria-label={label}
    >
      <motion.div
        className="rounded-full border-2 border-foreground/20 border-t-foreground"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

// ============================================
// 14. FULL PAGE LOADER APRIMORADO
// ============================================

interface EnhancedFullPageLoaderProps {
  isLoading: boolean
  variant?: 'glass' | 'liquid' | 'neumorphic' | 'minimal'
  showMessage?: boolean
  showProgress?: boolean
  estimatedTime?: string
}

export function EnhancedFullPageLoader({ 
  isLoading, 
  variant = 'glass',
  showMessage = true,
  showProgress = true,
  estimatedTime,
}: EnhancedFullPageLoaderProps) {
  const message = useLoadingMessage()
  
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
          
          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {variant === 'glass' && <GlassLoader size={100} />}
            {variant === 'liquid' && <LiquidLoader size={100} />}
            {variant === 'neumorphic' && <NeumorphicSpinner size={80} />}
            {variant === 'minimal' && <WaveLoader />}
            
            {showMessage && (
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <LoadingMessage />
              </motion.div>
            )}
            
            {estimatedTime && (
              <motion.p
                className="mt-2 text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Tempo estimado: {estimatedTime}
              </motion.p>
            )}
            
            {showProgress && (
              <motion.div
                className="mt-6 w-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <FuturisticProgress indeterminate />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
