'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { logoutUser, checkAuthSession } from '@/lib/store/slices/authSlice'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Settings, 
  User, 
  Bell, 
  Radio, 
  Monitor, 
  Moon, 
  Sun, 
  Smartphone,
  Wifi,
  Save,
  LogOut,
  AlertTriangle,
  Check,
  Gauge,
  Volume2,
  Database
} from 'lucide-react'
import { SpaceBackground, BorderSnakeBeam } from '@/components/ui/space-background'

interface UserSettings {
  displayName: string
  email: string
  notifications: {
    telemetryAlerts: boolean
    missionUpdates: boolean
    communityMessages: boolean
    emailDigest: boolean
  }
  telemetry: {
    updateRate: '1hz' | '5hz' | '10hz'
    autoConnect: boolean
    saveToCloud: boolean
    soundAlerts: boolean
  }
  display: {
    theme: 'dark' | 'light' | 'system'
    compactMode: boolean
    showGrid: boolean
    animationsEnabled: boolean
  }
}

const defaultSettings: UserSettings = {
  displayName: '',
  email: '',
  notifications: {
    telemetryAlerts: true,
    missionUpdates: true,
    communityMessages: true,
    emailDigest: false,
  },
  telemetry: {
    updateRate: '10hz',
    autoConnect: false,
    saveToCloud: true,
    soundAlerts: true,
  },
  display: {
    theme: 'dark',
    compactMode: false,
    showGrid: true,
    animationsEnabled: true,
  },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'telemetry' | 'display'>('profile')
  const router = useRouter()
  
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuthSession())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        displayName: user.displayName || user.username || '',
        email: user.email || '',
      }))
    }
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('galaxy-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch {
        // Ignore parse errors
      }
    }
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    
    // Save to localStorage
    localStorage.setItem('galaxy-settings', JSON.stringify(settings))
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push('/auth/login')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'telemetry', label: 'Telemetry', icon: Radio },
    { id: 'display', label: 'Display', icon: Monitor },
  ] as const

  return (
    <SpaceBackground showMeteors showBeams>
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 lg:px-6 py-12 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Settings className="w-8 h-8" />
                Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your account and application preferences
              </p>
            </div>
            
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : saving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border pb-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-foreground text-background' 
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <BorderSnakeBeam className="rounded-lg">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Your call sign"
                    className="max-w-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    disabled
                    className="max-w-md bg-secondary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
                
                <div className="pt-6 border-t border-border">
                  <h3 className="text-sm font-medium text-destructive flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4" />
                    Danger Zone
                  </h3>
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <SettingToggle
                  label="Telemetry Alerts"
                  description="Get notified when telemetry values exceed thresholds"
                  icon={<Radio className="w-5 h-5" />}
                  checked={settings.notifications.telemetryAlerts}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      notifications: { ...prev.notifications, telemetryAlerts: checked } 
                    }))
                  }
                />
                
                <SettingToggle
                  label="Mission Updates"
                  description="Notifications about mission status changes"
                  icon={<Bell className="w-5 h-5" />}
                  checked={settings.notifications.missionUpdates}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      notifications: { ...prev.notifications, missionUpdates: checked } 
                    }))
                  }
                />
                
                <SettingToggle
                  label="Community Messages"
                  description="Get notified about new messages and mentions"
                  icon={<User className="w-5 h-5" />}
                  checked={settings.notifications.communityMessages}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      notifications: { ...prev.notifications, communityMessages: checked } 
                    }))
                  }
                />
                
                <SettingToggle
                  label="Email Digest"
                  description="Weekly summary of activity sent to your email"
                  icon={<Bell className="w-5 h-5" />}
                  checked={settings.notifications.emailDigest}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      notifications: { ...prev.notifications, emailDigest: checked } 
                    }))
                  }
                />
              </motion.div>
            )}

            {/* Telemetry Tab */}
            {activeTab === 'telemetry' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-muted-foreground" />
                    Update Rate
                  </Label>
                  <div className="flex gap-2">
                    {(['1hz', '5hz', '10hz'] as const).map(rate => (
                      <button
                        key={rate}
                        onClick={() => setSettings(prev => ({ 
                          ...prev, 
                          telemetry: { ...prev.telemetry, updateRate: rate } 
                        }))}
                        className={`
                          px-4 py-2 rounded-lg font-mono text-sm transition-colors
                          ${settings.telemetry.updateRate === rate 
                            ? 'bg-foreground text-background' 
                            : 'bg-secondary text-muted-foreground hover:text-foreground'
                          }
                        `}
                      >
                        {rate.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Higher rates provide more data but use more bandwidth
                  </p>
                </div>
                
                <SettingToggle
                  label="Auto-Connect LoRa"
                  description="Automatically connect to LoRa device on page load"
                  icon={<Wifi className="w-5 h-5" />}
                  checked={settings.telemetry.autoConnect}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      telemetry: { ...prev.telemetry, autoConnect: checked } 
                    }))
                  }
                />
                
                <SettingToggle
                  label="Save to Cloud"
                  description="Automatically save telemetry data"
                  icon={<Database className="w-5 h-5" />}
                  checked={settings.telemetry.saveToCloud}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      telemetry: { ...prev.telemetry, saveToCloud: checked } 
                    }))
                  }
                />
                
                <SettingToggle
                  label="Sound Alerts"
                  description="Play audio alerts for critical events"
                  icon={<Volume2 className="w-5 h-5" />}
                  checked={settings.telemetry.soundAlerts}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      telemetry: { ...prev.telemetry, soundAlerts: checked } 
                    }))
                  }
                />
              </motion.div>
            )}

            {/* Display Tab */}
            {activeTab === 'display' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-muted-foreground" />
                    Theme
                  </Label>
                  <div className="flex gap-2">
                    {([
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'system', label: 'System', icon: Smartphone },
                    ] as const).map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => setSettings(prev => ({ 
                          ...prev, 
                          display: { ...prev.display, theme: theme.id } 
                        }))}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors
                          ${settings.display.theme === theme.id 
                            ? 'bg-foreground text-background' 
                            : 'bg-secondary text-muted-foreground hover:text-foreground'
                          }
                        `}
                      >
                        <theme.icon className="w-4 h-4" />
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <SettingToggle
                  label="Compact Mode"
                  description="Reduce spacing and padding throughout the UI"
                  icon={<Monitor className="w-5 h-5" />}
                  checked={settings.display.compactMode}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      display: { ...prev.display, compactMode: checked } 
                    }))
                  }
                />
                
                <SettingToggle
                  label="Show Grid Background"
                  description="Display the grid pattern on backgrounds"
                  icon={<Monitor className="w-5 h-5" />}
                  checked={settings.display.showGrid}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      display: { ...prev.display, showGrid: checked } 
                    }))
                  }
                />
                
                <SettingToggle
                  label="Animations"
                  description="Enable smooth animations and transitions"
                  icon={<Monitor className="w-5 h-5" />}
                  checked={settings.display.animationsEnabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      display: { ...prev.display, animationsEnabled: checked } 
                    }))
                  }
                />
              </motion.div>
            )}
          </div>
          </BorderSnakeBeam>
        </motion.div>
      </main>
    </SpaceBackground>
  )
}

interface SettingToggleProps {
  label: string
  description: string
  icon: React.ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function SettingToggle({ label, description, icon, checked, onCheckedChange }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-start gap-3">
        <div className="text-muted-foreground mt-0.5">{icon}</div>
        <div>
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
