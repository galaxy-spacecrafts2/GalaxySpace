'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Monitor, 
  CheckCircle, 
  XCircle, 
  Shield, 
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppSelector } from '@/lib/store/hooks'

function QRConfirmContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session')
  
  const [status, setStatus] = useState<'loading' | 'confirm' | 'success' | 'error' | 'expired'>('loading')
  const [deviceInfo, setDeviceInfo] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  // Check session and mark as scanned
  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setError('Link invalido. Tente escanear novamente.')
      return
    }
    
    if (!isAuthenticated || !user) {
      // Redirect to login if not authenticated
      router.push(`/auth/login?redirect=/auth/qr-confirm?session=${sessionId}`)
      return
    }
    
    // Mark session as scanned
    async function scanSession() {
      try {
        const response = await fetch('/api/auth/qr/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            action: 'scan',
          }),
        })
        
        const data = await response.json()
        
        if (data.success) {
          setStatus('confirm')
          setDeviceInfo(data.deviceInfo || 'Dispositivo desconhecido')
        } else if (response.status === 410) {
          setStatus('expired')
        } else {
          setStatus('error')
          setError(data.error || 'Sessao nao encontrada')
        }
      } catch {
        setStatus('error')
        setError('Erro ao processar QR code')
      }
    }
    
    scanSession()
  }, [sessionId, isAuthenticated, user, router])

  // Confirm login
  const handleConfirm = async () => {
    if (!sessionId || !user) return
    
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/auth/qr/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'confirm',
          userId: user.id,
          userEmail: user.email,
          userName: user.name || user.username,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus('success')
        
        // Redirect after a moment
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setStatus('error')
        setError(data.error || 'Falha ao confirmar login')
      }
    } catch {
      setStatus('error')
      setError('Erro ao confirmar login')
    } finally {
      setIsProcessing(false)
    }
  }

  // Deny login
  const handleDeny = async () => {
    if (!sessionId) return
    
    setIsProcessing(true)
    
    try {
      await fetch('/api/auth/qr/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'deny',
        }),
      })
      
      router.push('/')
    } catch {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md bg-black/60 border-white/10 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {status === 'loading' && 'Verificando...'}
              {status === 'confirm' && 'Confirmar Acesso'}
              {status === 'success' && 'Acesso Autorizado!'}
              {status === 'error' && 'Erro'}
              {status === 'expired' && 'Sessao Expirada'}
            </CardTitle>
            <CardDescription className="text-white/60">
              {status === 'confirm' && 'Um dispositivo quer acessar sua conta'}
              {status === 'success' && 'O dispositivo foi conectado com sucesso'}
              {status === 'error' && error}
              {status === 'expired' && 'O QR code expirou. Gere um novo.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {status === 'loading' && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
              </div>
            )}
            
            {status === 'confirm' && (
              <>
                {/* Device info card */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-cyan-500/10">
                      <Monitor className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Dispositivo solicitante</p>
                      <p className="text-white/60 text-sm">{deviceInfo}</p>
                    </div>
                  </div>
                </div>
                
                {/* Warning */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-white/80 text-sm">
                    Apenas confirme se voce reconhece este dispositivo. Nao compartilhe seu acesso.
                  </p>
                </div>
                
                {/* User info */}
                <div className="text-center py-2">
                  <p className="text-white/60 text-sm">Conectando como:</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDeny}
                    disabled={isProcessing}
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Negar
                  </Button>
                  
                  <Button
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Autorizar
                  </Button>
                </div>
              </>
            )}
            
            {status === 'success' && (
              <div className="flex flex-col items-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle className="w-20 h-20 text-green-400" />
                </motion.div>
                <p className="text-white/60 mt-4">Redirecionando...</p>
              </div>
            )}
            
            {(status === 'error' || status === 'expired') && (
              <div className="flex flex-col items-center py-8">
                <XCircle className="w-20 h-20 text-red-400" />
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="mt-6 border-white/20 text-white hover:bg-white/10"
                >
                  Voltar para Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function QRConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    }>
      <QRConfirmContent />
    </Suspense>
  )
}
