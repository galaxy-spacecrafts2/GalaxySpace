'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Rocket, Mail, CheckCircle, ArrowRight } from 'lucide-react'
import { SpaceBackground, BorderSnakeBeam } from '@/components/ui/space-background'

export default function SignUpSuccessPage() {
  return (
    <SpaceBackground showMeteors showBeams className="flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <BorderSnakeBeam className="rounded-lg" beamColor="cyan">
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-lg p-8 text-center">
          {/* Success animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"
          >
            <CheckCircle className="h-10 w-10 text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Registration Complete!
            </h1>
            <p className="text-muted-foreground mb-6">
              Welcome to Galaxy.SpaceCrafts, astronaut.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-secondary/50 rounded-md border border-border mb-6"
          >
            <div className="flex items-center justify-center gap-2 text-primary mb-2">
              <Mail className="h-5 w-5" />
              <span className="font-medium">Check Your Email</span>
            </div>
            <p className="text-sm text-muted-foreground">
              We sent a confirmation link to your email. Click it to activate your astronaut credentials.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <Link href="/auth/login">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Rocket className="mr-2 h-4 w-4" />
                Go to Mission Control
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
                Return to Homepage
              </Button>
            </Link>
          </motion.div>
        </div>
        </BorderSnakeBeam>
      </motion.div>
    </SpaceBackground>
  )
}
