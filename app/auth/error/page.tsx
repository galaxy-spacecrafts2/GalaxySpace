'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import { SpaceBackground, BorderSnakeBeam } from '@/components/ui/space-background'

function ErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'An error occurred during authentication'

  return (
    <SpaceBackground showMeteors showBeams className="flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <BorderSnakeBeam className="rounded-lg" beamColor="purple">
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-lg p-8 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Rocket className="h-10 w-10 text-muted-foreground" />
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                GALAXY.SPACECRAFTS
              </h1>
            </div>
          </div>

          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mx-auto mb-6 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center"
          >
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </motion.div>

          <h2 className="text-xl font-bold text-foreground mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-6">{message}</p>

          <div className="flex flex-col gap-3">
            <Link href="/auth/login">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Go to Home
              </Button>
            </Link>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground font-mono">ERROR CODE: AUTH_FAILED</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
        </BorderSnakeBeam>
      </motion.div>
    </SpaceBackground>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
