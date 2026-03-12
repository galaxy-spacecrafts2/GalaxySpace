"use client"

import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'

interface GPSDisplayProps {
  lat: number
  lng: number
}

export function GPSDisplay({ lat, lng }: GPSDisplayProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 relative overflow-hidden h-full">
      {/* Radar sweep effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="absolute w-[200%] h-[200%] border border-foreground/10 rounded-full"
          animate={{ scale: [0.5, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute w-[200%] h-[200%] border border-foreground/10 rounded-full"
          animate={{ scale: [0.5, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1 }}
        />
        <motion.div
          className="absolute w-[200%] h-[200%] border border-foreground/10 rounded-full"
          animate={{ scale: [0.5, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 2 }}
        />
      </div>
      
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-foreground" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-foreground" />
      </div>
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
            GPS Position
          </h3>
          <motion.div
            className="flex items-center gap-1 text-[10px] font-mono text-green-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            LOCK
          </motion.div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="relative"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MapPin className="w-12 h-12 text-foreground" />
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-foreground/30 rounded-full blur-sm"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-3 h-3 text-muted-foreground rotate-45" />
              <span className="text-[10px] text-muted-foreground font-mono">LAT</span>
            </div>
            <motion.span
              className="text-sm font-mono text-foreground tabular-nums"
              key={lat.toFixed(6)}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
            >
              {lat.toFixed(6)}°
            </motion.span>
          </div>
          
          <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-3 h-3 text-muted-foreground -rotate-45" />
              <span className="text-[10px] text-muted-foreground font-mono">LNG</span>
            </div>
            <motion.span
              className="text-sm font-mono text-foreground tabular-nums"
              key={lng.toFixed(6)}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
            >
              {lng.toFixed(6)}°
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  )
}
