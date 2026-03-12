'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  MessageCircle, 
  Newspaper, 
  Bell,
  Settings,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { logoutUser } from '@/lib/store/slices/authSlice'
import { useRouter } from 'next/navigation'
import { CommunityFeed } from './community-feed'
import { LiveChat } from './live-chat'
import { UserProfile } from './user-profile'

interface CommunityPost {
  id: string
  userId: string
  content: string
  createdAt: string
  username: string
  avatarUrl?: string
  likes: number
  comments: number
}

interface ChatMessage {
  id: string
  userId: string
  content: string
  createdAt: string
  username: string
  avatarUrl?: string
}

interface CommunityDashboardProps {
  initialPosts?: CommunityPost[]
  initialMessages?: ChatMessage[]
}

type TabType = 'feed' | 'chat' | 'profile'

export function CommunityDashboard({ 
  initialPosts = [], 
  initialMessages = [] 
}: CommunityDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('feed')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push('/')
    router.refresh()
  }

  const tabs = [
    { id: 'feed' as TabType, label: 'Feed', icon: Newspaper },
    { id: 'chat' as TabType, label: 'Live Chat', icon: MessageCircle },
    { id: 'profile' as TabType, label: 'Profile', icon: Users },
  ]

  const profile = user ? {
    id: user.id,
    username: user.username || null,
    avatar_url: user.avatarUrl || null,
    bio: user.bio || null,
    role: user.role || 'astronaut',
  } : null

  return (
    <div className="relative">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Tabs */}
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 ${
                    activeTab === tab.id 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </Button>
              ))}
            </div>

            {/* User actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Settings className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <CommunityFeed 
                userId={user?.id || ''} 
                username={user?.username || 'Astronaut'}
                initialPosts={initialPosts} 
              />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <LiveChat 
                userId={user?.id || ''} 
                username={user?.username || 'Astronaut'}
                initialMessages={initialMessages} 
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <UserProfile profile={profile} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
