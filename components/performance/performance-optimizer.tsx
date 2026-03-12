'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Zap, 
  Monitor, 
  Cpu, 
  Gauge,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { 
  FPSMonitor, 
  MemoryMonitor, 
  PerformanceMonitor,
  usePerformanceOptimization 
} from '@/lib/performance/optimization'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PerformanceMetrics {
  fps: number
  memory: { used: number; total: number; percentage: number } | null
  metrics: Record<string, { avg: number; count: number }>
}

export function PerformanceOptimizer() {
  const [isVisible, setIsVisible] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: null,
    metrics: {}
  })
  const [isMonitoring, setIsMonitoring] = useState(false)
  
  const { 
    startFPSMonitoring, 
    stopFPSMonitoring, 
    getCurrentFPS, 
    getMemoryUsage,
    measurePerformance 
  } = usePerformanceOptimization()
  
  const fpsMonitor = FPSMonitor.getInstance()
  const memoryMonitor = MemoryMonitor.getInstance()
  const performanceMonitor = PerformanceMonitor.getInstance()

  useEffect(() => {
    if (isMonitoring) {
      startFPSMonitoring()
      
      const fpsCallback = (fps: number) => {
        setMetrics(prev => ({
          ...prev,
          fps
        }))
      }
      
      fpsMonitor.onFPSUpdate(fpsCallback)
      
      const interval = setInterval(() => {
        const memory = getMemoryUsage()
        const perfMetrics = performanceMonitor.getMetrics()
        
        setMetrics(prev => ({
          ...prev,
          memory,
          metrics: perfMetrics
        }))
      }, 1000)
      
      return () => {
        stopFPSMonitoring()
        clearInterval(interval)
      }
    }
  }, [isMonitoring, startFPSMonitoring, stopFPSMonitoring, getMemoryUsage])

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
  }

  const clearMetrics = () => {
    performanceMonitor.metrics.clear()
    setMetrics({
      fps: 0,
      memory: null,
      metrics: {}
    })
  }

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400'
    if (fps >= 30) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getMemoryColor = (percentage: number) => {
    if (percentage <= 70) return 'text-green-400'
    if (percentage <= 85) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <>
      {/* Performance Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        variant="ghost"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-black/80 border border-white/20 text-white hover:bg-white/10"
      >
        <Gauge className="w-4 h-4 mr-2" />
        Performance
      </Button>

      {/* Performance Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-16 right-4 z-50 w-80"
          >
            <Card className="bg-black/90 border border-white/20 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Performance Monitor
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={toggleMonitoring}
                      size="sm"
                      variant={isMonitoring ? "default" : "outline"}
                      className={`h-6 px-2 text-xs ${
                        isMonitoring 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      {isMonitoring ? 'Stop' : 'Start'}
                    </Button>
                    <Button
                      onClick={clearMetrics}
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-white/60 hover:text-white"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* FPS */}
                <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-400" />
                    <span className="text-white/80 text-sm">FPS</span>
                  </div>
                  <span className={`text-sm font-mono ${getFPSColor(metrics.fps)}`}>
                    {metrics.fps}
                  </span>
                </div>

                {/* Memory */}
                {metrics.memory && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        <span className="text-white/80 text-sm">Memory</span>
                      </div>
                      <span className={`text-sm font-mono ${getMemoryColor(metrics.memory.percentage)}`}>
                        {metrics.memory.used}MB / {metrics.memory.total}MB
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all ${
                          metrics.memory.percentage <= 70 ? 'bg-green-400' :
                          metrics.memory.percentage <= 85 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${metrics.memory.percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Performance Metrics */}
                {Object.keys(metrics.metrics).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-white/60 text-xs font-medium">Operations</h4>
                    {Object.entries(metrics.metrics).map(([name, data]) => (
                      <div key={name} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <span className="text-white/60 text-xs truncate flex-1">{name}</span>
                        <span className="text-white/80 text-xs font-mono">
                          {data.avg.toFixed(2)}ms
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                  {isMonitoring ? (
                    <>
                      <Zap className="w-3 h-3 text-green-400 animate-pulse" />
                      <span className="text-green-400 text-xs">Monitoring Active</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400 text-xs">Monitoring Paused</span>
                    </>
                  )}
                </div>

                {/* Performance Tips */}
                {metrics.fps < 30 && (
                  <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <p className="text-yellow-400 text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Low FPS detected. Consider reducing animations.
                    </p>
                  </div>
                )}

                {metrics.memory && metrics.memory.percentage > 85 && (
                  <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      High memory usage. Consider optimizing components.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Performance HOC for components
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    const { measurePerformance } = usePerformanceOptimization()
    const renderCount = useRef(0)
    
    useEffect(() => {
      renderCount.current++
      measurePerformance(`${componentName}-render-${renderCount.current}`, () => {
        // Component render logic
      })
    })
    
    return <WrappedComponent {...props} />
  }
}

// Performance optimized animation wrapper
export function OptimizedAnimation({ 
  children, 
  ...props 
}: { children: React.ReactNode } & Parameters<typeof motion.div>[0]) {
  return (
    <motion.div
      {...props}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1],
        ...props.transition 
      }}
    >
      {children}
    </motion.div>
  )
}
