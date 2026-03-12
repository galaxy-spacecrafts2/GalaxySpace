'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Simple Providers component for static export
function SimpleProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export default function NotFound() {
  return (
    <SimpleProviders>
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center"
            >
              <Search className="w-8 h-8 text-cyan-400" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-white mb-2">404</h1>
            <h2 className="text-xl text-white/80 mb-4">Page Not Found</h2>
            <p className="text-white/60 mb-8">
              The page you're looking for doesn't exist or has been moved to another location.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-white/40 text-sm">
              Galaxy SpaceCrafts Mission Control
            </p>
          </motion.div>
        </motion.div>
      </div>
    </SimpleProviders>
  )
}
