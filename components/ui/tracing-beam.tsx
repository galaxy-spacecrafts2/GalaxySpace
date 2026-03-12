"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface TracingBeamProps {
  children: React.ReactNode
  className?: string
}

export function TracingBeam({ children, className }: TracingBeamProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const contentRef = useRef<HTMLDivElement>(null)
  const [svgHeight, setSvgHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight)
    }
  }, [])

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    {
      stiffness: 500,
      damping: 90,
    }
  )
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
    {
      stiffness: 500,
      damping: 90,
    }
  )

  return (
    <motion.div
      ref={ref}
      className={cn("relative w-full max-w-4xl mx-auto", className)}
    >
      <div className="absolute -left-4 md:-left-20 top-3">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          animate={{
            boxShadow:
              scrollYProgress.get() > 0
                ? "none"
                : "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="ml-[27px] h-4 w-4 rounded-full border border-foreground/20 shadow-sm flex items-center justify-center"
        >
          <motion.div
            transition={{
              duration: 0.2,
              delay: 0.5,
            }}
            animate={{
              backgroundColor: scrollYProgress.get() > 0 ? "hsl(var(--foreground))" : "transparent",
              borderColor: scrollYProgress.get() > 0 ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
            }}
            className="h-2 w-2 rounded-full border border-foreground/30 bg-transparent"
          />
        </motion.div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0 V -36 l 18 24 V ${svgHeight * 0.8} l -18 24 V ${svgHeight}`}
            fill="none"
            stroke="hsl(var(--foreground) / 0.2)"
            strokeOpacity="0.16"
            transition={{
              duration: 10,
            }}
          />
          <motion.path
            d={`M 1 0 V -36 l 18 24 V ${svgHeight * 0.8} l -18 24 V ${svgHeight}`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="1.25"
            className="motion-reduce:hidden"
            transition={{
              duration: 10,
            }}
          />
          <defs>
            <motion.linearGradient
              id="gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="hsl(var(--foreground))" stopOpacity="0" />
              <stop stopColor="hsl(var(--foreground))" />
              <stop offset="0.325" stopColor="hsl(var(--primary))" />
              <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  )
}

// Simpler version for horizontal use
interface HorizontalBeamProps {
  className?: string
  delay?: number
}

export function HorizontalBeam({ className, delay = 0 }: HorizontalBeamProps) {
  return (
    <div className={cn("relative h-px w-full overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "linear",
          delay,
        }}
      />
      <div className="absolute inset-0 bg-border" />
    </div>
  )
}

// Glow line effect
interface GlowLineProps {
  direction?: "horizontal" | "vertical"
  className?: string
}

export function GlowLine({ direction = "horizontal", className }: GlowLineProps) {
  const isHorizontal = direction === "horizontal"
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        isHorizontal ? "h-px w-full" : "w-px h-full",
        className
      )}
    >
      <div 
        className={cn(
          "absolute bg-border",
          isHorizontal ? "inset-0" : "inset-0"
        )} 
      />
      <motion.div
        className={cn(
          "absolute bg-gradient-to-r from-transparent via-foreground/50 to-transparent",
          isHorizontal ? "h-full w-1/4" : "w-full h-1/4"
        )}
        animate={
          isHorizontal 
            ? { x: ["-100%", "500%"] }
            : { y: ["-100%", "500%"] }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}
