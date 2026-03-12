"use client"

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/components/ui/loaders'

function SkeletonPulse({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion()
  
  if (prefersReduced) {
    return <div className={`bg-muted/50 rounded ${className}`} />
  }
  
  return (
    <motion.div
      className={`bg-muted/50 rounded ${className}`}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function GaugeCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <SkeletonPulse className="h-4 w-24" />
      <div className="flex items-center justify-center py-6">
        <SkeletonPulse className="w-24 h-24 rounded-full" />
      </div>
      <div className="flex justify-between">
        <SkeletonPulse className="h-3 w-12" />
        <SkeletonPulse className="h-3 w-16" />
      </div>
    </div>
  )
}

function ChartCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 h-[280px]">
      <SkeletonPulse className="h-4 w-32 mb-4" />
      <div className="h-[220px] flex items-end justify-between gap-2 px-4">
        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 65].map((height, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-muted/30 rounded-t"
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          />
        ))}
      </div>
    </div>
  )
}

function ConnectionCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-32" />
        <SkeletonPulse className="h-6 w-6 rounded-full" />
      </div>
      <SkeletonPulse className="h-10 w-full rounded-lg" />
      <div className="flex gap-2">
        <SkeletonPulse className="h-8 flex-1 rounded" />
        <SkeletonPulse className="h-8 flex-1 rounded" />
      </div>
    </div>
  )
}

function OrientationCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <SkeletonPulse className="h-4 w-28 mb-4" />
      <div className="flex items-center justify-center py-8">
        <SkeletonPulse className="w-32 h-32 rounded-lg" />
      </div>
    </div>
  )
}

function FlightPhaseSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <SkeletonPulse className="w-8 h-8 rounded-full" />
            <SkeletonPulse className="h-2 w-full max-w-[60px]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  const prefersReduced = useReducedMotion()
  
  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <SkeletonPulse className="h-8 w-48 mb-2" />
          <SkeletonPulse className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-6">
          <SkeletonPulse className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Flight Phase Skeleton */}
      <motion.div
        className="mb-6"
        initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FlightPhaseSkeleton />
      </motion.div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={prefersReduced ? {} : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              {i === 0 ? <ConnectionCardSkeleton /> : <GaugeCardSkeleton />}
            </motion.div>
          ))}
        </div>

        {/* Center Column */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <ChartCardSkeleton />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
              >
                <OrientationCardSkeleton />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={prefersReduced ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <GaugeCardSkeleton />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Skeleton */}
      <motion.div
        className="mt-6 bg-card border border-border rounded-lg p-4"
        initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonPulse key={i} className="h-4 w-20" />
            ))}
          </div>
          <SkeletonPulse className="h-4 w-32" />
        </div>
      </motion.div>
    </div>
  )
}
