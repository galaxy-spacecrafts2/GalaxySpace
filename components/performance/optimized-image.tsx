'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/lib/performance/optimization'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string>('')
  const imgRef = useRef<HTMLImageElement>(null)
  
  const isVisible = useIntersectionObserver(imgRef, {
    rootMargin: '50px',
    threshold: 0.1
  })

  // Optimize image URL
  const getOptimizedSrc = (originalSrc: string) => {
    if (!originalSrc) return ''
    
    // Add quality parameter
    const separator = originalSrc.includes('?') ? '&' : '?'
    return `${originalSrc}${separator}quality=${quality}${width ? `&width=${width}` : ''}`
  }

  // Load image when visible or priority
  useEffect(() => {
    if (priority || isVisible) {
      const optimizedSrc = getOptimizedSrc(src)
      setCurrentSrc(optimizedSrc)
    }
  }, [priority, isVisible, src, quality, width])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Generate placeholder
  const renderPlaceholder = () => {
    if (placeholder === 'blur' && blurDataURL) {
      return (
        <div 
          className="absolute inset-0 bg-cover bg-center blur-sm"
          style={{ backgroundImage: `url(${blurDataURL})` }}
        />
      )
    }
    
    return (
      <div className="absolute inset-0 bg-gray-800 animate-pulse" />
    )
  }

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-800 text-gray-400 ${className}`}
        style={{ width, height }}
      >
        <span className="text-sm">Failed to load</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Placeholder */}
      {!isLoaded && renderPlaceholder()}
      
      {/* Actual image */}
      {(priority || isVisible) && currentSrc && (
        <motion.img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Loading indicator */}
      {!isLoaded && (priority || isVisible) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

// Lazy loaded image component
export function LazyImage(props: OptimizedImageProps) {
  return <OptimizedImage {...props} priority={false} />
}

// Priority loaded image component
export function PriorityImage(props: OptimizedImageProps) {
  return <OptimizedImage {...props} priority={true} />
}
