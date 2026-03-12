"use client"

import { motion } from 'framer-motion'

interface TelemetryGaugeProps {
  label: string
  value: number
  unit: string
  min: number
  max: number
  decimals?: number
  warning?: number
  critical?: number
}

export function TelemetryGauge({
  label,
  value,
  unit,
  min,
  max,
  decimals = 1,
  warning,
  critical,
}: TelemetryGaugeProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  
  const getStatusColor = () => {
    if (critical !== undefined && value >= critical) return 'bg-red-500'
    if (warning !== undefined && value >= warning) return 'bg-yellow-500'
    return 'bg-foreground'
  }

  const getGlowColor = () => {
    if (critical !== undefined && value >= critical) return 'shadow-red-500/50'
    if (warning !== undefined && value >= warning) return 'shadow-yellow-500/50'
    return 'shadow-foreground/20'
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 relative overflow-hidden group">
      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/5 to-transparent"
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
            {label}
          </span>
          <motion.div
            className={`w-2 h-2 rounded-full ${getStatusColor()} shadow-lg ${getGlowColor()}`}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        
        <div className="flex items-baseline gap-1 mb-3">
          <motion.span
            className="text-3xl font-mono font-bold text-foreground tabular-nums"
            key={value}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
          >
            {value.toFixed(decimals)}
          </motion.span>
          <span className="text-sm text-muted-foreground font-mono">{unit}</span>
        </div>
        
        {/* Progress bar */}
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${getStatusColor()} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground font-mono">{min}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{max}</span>
        </div>
      </div>
    </div>
  )
}
