'use client'

import { useState, useEffect } from 'react'

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTimer(name: string): () => void {
    const startTime = performance.now()
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (!this.metrics.has(name)) {
        this.metrics.set(name, [])
      }
      this.metrics.get(name)!.push(duration)
      
      // Keep only last 10 measurements
      const measurements = this.metrics.get(name)!
      if (measurements.length > 10) {
        measurements.shift()
      }
    }
  }

  getAverageTime(name: string): number {
    const measurements = this.metrics.get(name) || []
    if (measurements.length === 0) return 0
    return measurements.reduce((a, b) => a + b, 0) / measurements.length
  }

  getMetrics(): Record<string, { avg: number; count: number }> {
    const result: Record<string, { avg: number; count: number }> = {}
    
    for (const [name, measurements] of this.metrics.entries()) {
      result[name] = {
        avg: measurements.reduce((a, b) => a + b, 0) / measurements.length,
        count: measurements.length
      }
    }
    
    return result
  }
}

// FPS Monitor
export class FPSMonitor {
  private static instance: FPSMonitor
  private fps: number = 0
  private lastTime: number = performance.now()
  private frames: number = 0
  private callbacks: ((fps: number) => void)[] = []
  private animationId: number | null = null

  static getInstance(): FPSMonitor {
    if (!FPSMonitor.instance) {
      FPSMonitor.instance = new FPSMonitor()
    }
    return FPSMonitor.instance
  }

  start(): void {
    this.lastTime = performance.now()
    this.frames = 0
    this.tick()
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  onFPSUpdate(callback: (fps: number) => void): void {
    this.callbacks.push(callback)
  }

  private tick(): void {
    this.frames++
    const currentTime = performance.now()
    
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime))
      this.frames = 0
      this.lastTime = currentTime
      
      // Notify callbacks
      this.callbacks.forEach(callback => callback(this.fps))
    }
    
    this.animationId = requestAnimationFrame(() => this.tick())
  }

  getCurrentFPS(): number {
    return this.fps
  }
}

// Memory Monitor
export class MemoryMonitor {
  private static instance: MemoryMonitor

  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor()
    }
    return MemoryMonitor.instance
  }

  getMemoryUsage(): { used: number; total: number; percentage: number } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100)
      }
    }
    return null
  }
}

// Performance optimization hooks
export const usePerformanceOptimization = () => {
  const fpsMonitor = FPSMonitor.getInstance()
  const memoryMonitor = MemoryMonitor.getInstance()

  return {
    startFPSMonitoring: () => fpsMonitor.start(),
    stopFPSMonitoring: () => fpsMonitor.stop(),
    getCurrentFPS: () => fpsMonitor.getCurrentFPS(),
    getMemoryUsage: () => memoryMonitor.getMemoryUsage(),
    measurePerformance: (name: string, fn: () => void | Promise<void>) => {
      const endTimer = PerformanceMonitor.getInstance().startTimer(name)
      const result = fn()
      if (result instanceof Promise) {
        return result.finally(endTimer)
      } else {
        endTimer()
        return result
      }
    }
  }
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Lazy load utility
export function createLazyComponent<T extends React.ComponentType<any>>(
  loader: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(loader)
}

// Intersection Observer for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, options])

  return isIntersecting
}

// Virtual scroll helper
export function calculateVisibleItems<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  scrollTop: number
): { visibleItems: T[]; startIndex: number; endIndex: number } {
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  )
  
  return {
    visibleItems: items.slice(startIndex, endIndex + 1),
    startIndex,
    endIndex
  }
}

// Image optimization utility
export function optimizeImageSrc(src: string, width?: number, quality?: number): string {
  const params = new URLSearchParams()
  if (width) params.append('w', width.toString())
  if (quality) params.append('q', quality.toString())
  
  const paramString = params.toString()
  return paramString ? `${src}?${paramString}` : src
}

// Preload critical resources
export function preloadResource(href: string, as: string): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  }
}
