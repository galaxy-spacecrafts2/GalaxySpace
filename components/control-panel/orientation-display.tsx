"use client"

import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface OrientationDisplayProps {
  gyroX: number
  gyroY: number
  gyroZ: number
}

export function OrientationDisplay({ gyroX, gyroY, gyroZ }: OrientationDisplayProps) {
  // Normalize rotation values for display
  const rotateX = useMemo(() => Math.max(-30, Math.min(30, gyroX / 5)), [gyroX])
  const rotateY = useMemo(() => Math.max(-30, Math.min(30, gyroY / 5)), [gyroY])
  const rotateZ = useMemo(() => gyroZ / 10, [gyroZ])

  return (
    <div className="bg-card border border-border rounded-lg p-4 relative overflow-hidden">
      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="h-px bg-foreground"
            style={{ marginTop: `${i * 5}%` }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-4">
          Orientation
        </h3>
        
        <div className="flex items-center justify-center h-[180px]" style={{ perspective: '500px' }}>
          <motion.div
            className="relative w-20 h-32"
            style={{
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateX: rotateX,
              rotateY: rotateY,
              rotateZ: rotateZ,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {/* Rocket body */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-foreground/90 to-foreground/70 rounded-t-full"
              style={{ transform: 'translateZ(10px)' }}
            >
              {/* Nose cone detail */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-8 bg-foreground rounded-t-full" />
              
              {/* Body stripes */}
              <div className="absolute top-12 left-0 right-0 h-px bg-background/30" />
              <div className="absolute top-16 left-0 right-0 h-2 bg-background/20" />
              <div className="absolute top-24 left-0 right-0 h-px bg-background/30" />
            </div>
            
            {/* Fins */}
            <div 
              className="absolute -bottom-2 -left-3 w-3 h-8 bg-foreground/80"
              style={{ 
                transform: 'rotateY(-45deg) translateZ(5px)',
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              }}
            />
            <div 
              className="absolute -bottom-2 -right-3 w-3 h-8 bg-foreground/80"
              style={{ 
                transform: 'rotateY(45deg) translateZ(5px)',
                clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
              }}
            />
            
            {/* Exhaust glow */}
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-foreground/20 blur-md"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
        
        {/* Axis readings */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: 'X', value: gyroX },
            { label: 'Y', value: gyroY },
            { label: 'Z', value: gyroZ },
          ].map(axis => (
            <div key={axis.label} className="text-center">
              <span className="text-[10px] text-muted-foreground font-mono block">{axis.label}-AXIS</span>
              <motion.span
                className="text-sm font-mono text-foreground tabular-nums"
                key={axis.value.toFixed(1)}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
              >
                {axis.value.toFixed(1)}°/s
              </motion.span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
