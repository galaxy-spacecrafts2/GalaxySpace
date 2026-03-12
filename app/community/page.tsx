'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { checkAuthSession } from '@/lib/store/slices/authSlice'
import { CommunityDashboard } from '@/components/community/community-dashboard'
import { Navigation } from '@/components/navigation'
import { SpaceBackground } from '@/components/ui/space-background'

export default function CommunityPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuthSession())
  }, [dispatch])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading while checking auth
  if (isLoading || !isAuthenticated) {
    return (
      <SpaceBackground showMeteors showBeams className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
      </SpaceBackground>
    )
  }

  return (
    <SpaceBackground showMeteors showBeams className="flex flex-col">
      <Navigation />
      <main className="flex-1">
        <CommunityDashboard />
      </main>
    </SpaceBackground>
  )
}
