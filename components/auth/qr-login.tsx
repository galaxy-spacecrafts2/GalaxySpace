'use client'

import { useState, useEffect, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Loader2,
  QrCode,
  Scan,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppDispatch } from '@/lib/store/hooks'
import { setCredentials } from '@/lib/store/slices/authSlice'
import { useRouter } from 'next/navigation'

interface QRSession {
  sessionId: string
  qrData: string
  authUrl: string
  expiresAt: number
  expiresIn: number
}

type QRStatus = 'generating' | 'pending' | 'scanned' | 'confirmed' | 'expired' | 'error'

export function QRLogin() {
  const [qrSession, setQrSession] = useState<QRSession | null>(null)
  const [status, setStatus] = useState<QRStatus>('generating')
  const [remainingTime, setRemainingTime] = useState(300)
  const [error, setError] = useState<string | null>(null)
  
  const dispatch = useAppDispatch()
  const router = useRouter()

  // Generate new QR code
  const generateQR = useCallback(async () => {
    setStatus('generating')
    setError(null)
    
    try {
      const response = await fetch('/api/auth/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceInfo: getDeviceInfo(),
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate QR code')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setQrSession(data)
        setStatus('pending')
        setRemainingTime(data.expiresIn)
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code')
      setStatus('error')
    }
  }, [])

  // Poll for QR status
  useEffect(() => {
    if (!qrSession || status === 'confirmed' || status === 'expired' || status === 'error') {
      return
    }
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/auth/qr/check?sessionId=${qrSession.sessionId}`)
        const data = await response.json()
        
        if (data.status === 'scanned') {
          setStatus('scanned')
        } else if (data.status === 'confirmed' && data.token) {
          setStatus('confirmed')
          
          // Store auth token
          dispatch(setCredentials({
            user: {
              id: data.user.id,
              email: data.user.email,
              username: data.user.name || data.user.email.split('@')[0],
              displayName: data.user.name,
            },
            token: data.token,
          }))
          
          // Store in Electron if available
          if (typeof window !== 'undefined' && (window as any).electronAPI) {
            await (window as any).electronAPI.storeAuthToken(data.token)
          }
          
          // Redirect after short delay
          setTimeout(() => {
            router.push('/')
          }, 1500)
        } else if (data.status === 'expired' || data.status === 'not_found') {
          setStatus('expired')
        }
        
        // Update remaining time
        if (data.remainingTime !== undefined) {
          setRemainingTime(Math.floor(data.remainingTime / 1000))
        }
      } catch (err) {
        console.error('Poll error:', err)
      }
    }, 2000) // Poll every 2 seconds
    
    return () => clearInterval(pollInterval)
  }, [qrSession, status, dispatch, router])

  // Countdown timer
  useEffect(() => {
    if (status !== 'pending' && status !== 'scanned') return
    
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setStatus('expired')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [status])

  // Generate QR on mount
  useEffect(() => {
    generateQR()
  }, [generateQR])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full max-w-md bg-black/40 border-white/10 backdrop-blur-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
            <QrCode className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-white">Login com QR Code</CardTitle>
        <CardDescription className="text-white/60">
          Escaneie com o app Galaxy SpaceCrafts no seu celular
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            {status === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-64 h-64 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10"
              >
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
              </motion.div>
            )}
            
            {(status === 'pending' || status === 'scanned') && qrSession && (
              <motion.div
                key="qr"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
                <div className="p-4 bg-white rounded-2xl">
                  <QRCodeSVG
                    value={qrSession.authUrl}
                    size={224}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: '/icon.png',
                      height: 40,
                      width: 40,
                      excavate: true,
                    }}
                  />
                </div>
                
                {status === 'scanned' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl"
                  >
                    <div className="text-center">
                      <Scan className="w-12 h-12 text-green-400 mx-auto mb-2 animate-pulse" />
                      <p className="text-white font-medium">QR Escaneado!</p>
                      <p className="text-white/60 text-sm">Confirme no seu celular</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
            
            {status === 'confirmed' && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-64 h-64 flex flex-col items-center justify-center bg-green-500/10 rounded-2xl border border-green-500/30"
              >
                <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                <p className="text-white font-semibold text-lg">Login Confirmado!</p>
                <p className="text-white/60 text-sm">Redirecionando...</p>
              </motion.div>
            )}
            
            {status === 'expired' && (
              <motion.div
                key="expired"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-64 h-64 flex flex-col items-center justify-center bg-red-500/10 rounded-2xl border border-red-500/30"
              >
                <XCircle className="w-16 h-16 text-red-400 mb-4" />
                <p className="text-white font-semibold">QR Code Expirado</p>
                <Button
                  onClick={generateQR}
                  variant="outline"
                  className="mt-4 border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Gerar Novo
                </Button>
              </motion.div>
            )}
            
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-64 h-64 flex flex-col items-center justify-center bg-red-500/10 rounded-2xl border border-red-500/30"
              >
                <XCircle className="w-16 h-16 text-red-400 mb-4" />
                <p className="text-white font-semibold">Erro</p>
                <p className="text-white/60 text-sm text-center px-4">{error}</p>
                <Button
                  onClick={generateQR}
                  variant="outline"
                  className="mt-4 border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Timer */}
        {(status === 'pending' || status === 'scanned') && (
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Expira em{' '}
              <span className={`font-mono font-bold ${remainingTime < 60 ? 'text-red-400' : 'text-cyan-400'}`}>
                {formatTime(remainingTime)}
              </span>
            </p>
          </div>
        )}
        
        {/* Instructions */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <p className="text-white/80 text-sm font-medium text-center mb-3">Como usar:</p>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 shrink-0">
              <Smartphone className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Abra o app no celular</p>
              <p className="text-white/40 text-xs">Galaxy SpaceCrafts para Android</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 shrink-0">
              <Scan className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Escaneie o QR Code</p>
              <p className="text-white/40 text-xs">Use a camera do app</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-500/10 shrink-0">
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Confirme o acesso</p>
              <p className="text-white/40 text-xs">Verifique o dispositivo e aprove</p>
            </div>
          </div>
        </div>
        
        {/* Device info */}
        <div className="flex items-center justify-center gap-2 text-white/40 text-xs pt-2">
          <Monitor className="w-3 h-3" />
          <span>{getDeviceInfo()}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper to get device info
function getDeviceInfo(): string {
  if (typeof window === 'undefined') return 'Unknown Device'
  
  const ua = navigator.userAgent
  let browser = 'Unknown Browser'
  let os = 'Unknown OS'
  
  // Detect browser
  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'
  else if (ua.includes('Edge')) browser = 'Edge'
  
  // Detect OS
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  
  // Check if Electron
  if ((window as any).electronAPI?.isElectron) {
    return `Galaxy SpaceCrafts Desktop - ${os}`
  }
  
  return `${browser} - ${os}`
}
