"use client"

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChartDataPoint } from '@/hooks/use-lora-telemetry'

interface AltitudeChartProps {
  chartData: ChartDataPoint[]
}

export function AltitudeChart({ chartData }: AltitudeChartProps) {
  const svgData = useMemo(() => {
    if (chartData.length < 2) return null
    
    const maxAltitude = Math.max(...chartData.map(d => d.altitude), 100)
    const width = 100
    const height = 100
    const padding = 5
    
    const points = chartData.map((d, i) => {
      const x = padding + ((i / (chartData.length - 1)) * (width - padding * 2))
      const y = height - padding - ((d.altitude / maxAltitude) * (height - padding * 2))
      return `${x},${y}`
    }).join(' ')
    
    // Area fill path
    const areaPath = `M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`
    
    return { points, areaPath, maxAltitude }
  }, [chartData])

  const currentAltitude = chartData[chartData.length - 1]?.altitude ?? 0

  return (
    <div className="bg-card border border-border rounded-lg p-4 relative overflow-hidden h-full">
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map(y => (
          <line
            key={y}
            x1="0"
            y1={`${y * 100}%`}
            x2="100%"
            y2={`${y * 100}%`}
            stroke="currentColor"
            strokeDasharray="4 4"
          />
        ))}
      </svg>
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-1">
              Altitude
            </h3>
            <div className="flex items-baseline gap-1">
              <motion.span
                className="text-2xl font-mono font-bold text-foreground tabular-nums"
                key={currentAltitude.toFixed(0)}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
              >
                {currentAltitude.toFixed(0)}
              </motion.span>
              <span className="text-sm text-muted-foreground font-mono">m</span>
            </div>
          </div>
          {svgData && (
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground font-mono block">MAX</span>
              <span className="text-sm font-mono text-foreground">{svgData.maxAltitude.toFixed(0)}m</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-h-[120px]">
          {svgData ? (
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              {/* Area fill with gradient */}
              <defs>
                <linearGradient id="altitudeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              
              <motion.path
                d={svgData.areaPath}
                fill="url(#altitudeGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              
              <motion.polyline
                points={svgData.points}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Current point indicator */}
              {chartData.length > 0 && (
                <motion.circle
                  cx={95}
                  cy={100 - 5 - ((currentAltitude / (svgData.maxAltitude || 1)) * 90)}
                  r="2"
                  fill="currentColor"
                  animate={{ r: [2, 3, 2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </svg>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs text-muted-foreground font-mono">Awaiting data...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
