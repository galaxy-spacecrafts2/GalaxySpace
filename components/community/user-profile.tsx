'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { updateUser } from '@/lib/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  User as UserIcon, 
  Mail, 
  Edit3, 
  Save, 
  Shield,
  Calendar,
  CheckCircle
} from 'lucide-react'

interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  bio: string | null
  role: string
}

interface UserProfileProps {
  profile: Profile | null
}

export function UserProfile({ profile }: UserProfileProps) {
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(profile?.username || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleSave = async () => {
    setSaving(true)
    
    // Update Redux state
    dispatch(updateUser({
      username: username.trim() || undefined,
      bio: bio.trim() || undefined,
    }))

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500))

    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setEditing(false)
    }, 1500)
    
    setSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg overflow-hidden"
      >
        {/* Profile header */}
        <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/5">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}
          />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4">
            <div className="w-24 h-24 rounded-full bg-secondary border-4 border-card flex items-center justify-center">
              <UserIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-500 border-2 border-card" />
          </div>

          {/* Profile info */}
          {editing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-input border-border text-foreground"
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-foreground">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="bg-input border-border text-foreground resize-none"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">{bio.length}/200</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {saving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                    />
                  ) : saved ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saved ? 'Saved!' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  className="border-border text-foreground hover:bg-secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {profile?.username || user?.username || 'Astronaut'}
                  </h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {profile?.role || user?.role || 'Member'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="border-border text-foreground hover:bg-secondary"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {(profile?.bio || user?.bio) && (
                <p className="text-foreground mb-4">{profile?.bio || user?.bio}</p>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Member
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { label: 'Posts', value: '0' },
          { label: 'Likes', value: '0' },
          { label: 'Comments', value: '0' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-4 text-center"
          >
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
