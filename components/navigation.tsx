"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { CustomRocketIcon } from '@/components/ui/custom-rocket-icon'
import { Radio, BookOpen, GraduationCap, FileText, Youtube, Menu, X, Users, Newspaper, LogIn, Settings } from 'lucide-react'
import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { checkAuthSession } from '@/lib/store/slices/authSlice'
import { useGlobalLoading } from '@/components/global-loading-provider'

const navItems = [
  { href: '/', label: 'Mission Control', icon: Radio },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/tutorials', label: 'Tutorials', icon: GraduationCap },
  { href: '/docs', label: 'Documentation', icon: FileText },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { startNavigation, endNavigation } = useGlobalLoading()
  
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  // Check auth session on mount
  useEffect(() => {
    dispatch(checkAuthSession())
  }, [dispatch])

  // Handle navigation with loading state
  const handleNavigation = (href: string) => {
    if (href === pathname) return
    startNavigation()
    startTransition(() => {
      router.push(href)
    })
  }

  useEffect(() => {
    if (!isPending) {
      endNavigation()
    }
  }, [isPending, endNavigation])

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CustomRocketIcon className="w-5 h-5 text-background" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-foreground tracking-tight">
                Galaxy.SpaceCrafts
              </span>
              <span className="block text-[10px] text-muted-foreground font-mono tracking-widest">
                ROCKET SYSTEMS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <button 
                  key={item.href} 
                  onClick={() => handleNavigation(item.href)}
                  disabled={isPending}
                >
                  <motion.div
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-colors
                      ${isActive 
                        ? 'bg-foreground text-background' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }
                      ${isPending ? 'opacity-70 cursor-wait' : ''}
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.div>
                </button>
              )
            })}
          </div>

          {/* Auth & YouTube Link & Mobile Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/settings">
                  <motion.div
                    className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-3 py-2 rounded-lg font-mono text-sm transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Settings className="w-4 h-4" />
                  </motion.div>
                </Link>
                <Link href="/community">
                  <motion.div
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-mono text-sm transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Users className="w-4 h-4" />
                    <span>Dashboard</span>
                  </motion.div>
                </Link>
              </div>
            ) : (
              <Link href="/auth/login">
                <motion.div
                  className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-mono text-sm transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </motion.div>
              </Link>
            )}
            <motion.a
              href="https://youtube.com/@galaxy.spacecrafts"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-mono text-sm transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Youtube className="w-4 h-4" />
              <span>Subscribe</span>
            </motion.a>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden border-t border-border bg-background"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleNavigation(item.href)
                  }}
                  disabled={isPending}
                  className="w-full"
                >
                  <div
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm
                      ${isActive 
                        ? 'bg-foreground text-background' 
                        : 'text-muted-foreground hover:bg-secondary'
                      }
                      ${isPending ? 'opacity-70 cursor-wait' : ''}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </button>
              )
            })}
            
            {isAuthenticated && user && (
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm text-muted-foreground hover:bg-secondary">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </div>
              </Link>
            )}
            
            <a
              href="https://youtube.com/@galaxy.spacecrafts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-red-600 text-white px-4 py-3 rounded-lg font-mono text-sm"
            >
              <Youtube className="w-5 h-5" />
              <span>Subscribe on YouTube</span>
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
