'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scan, 
  X, 
  Camera, 
  CheckCircle, 
  XCircle,
  Loader2,
  Smartphone,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCapacitorAPI } from '@/hooks/use-platform'
import { useAppSelector } from '@/lib/store/hooks'

interface QRScannerProps {
  onClose?: () => void
}

export function QRScanner({ onClose }: QRScannerProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'processing' | 'confirming' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [deviceInfo, setDeviceInfo] = useState<string>('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  const { scanQRCode, stopScanning, hapticFeedback, isCapacitor } = useCapacitorAPI()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  // Start scanning
  const startScan = useCallback(async () => {
    if (!isCapacitor) {
      setError('Scanner disponivel apenas no app nativo')
      setStatus('error')
      return
    }
    
    setStatus('scanning')
    setError(null)
    
    const result = await scanQRCode()
    
    if (result?.error) {
      setError(result.error)
      setStatus('error')
      hapticFeedback('heavy')
      return
    }
    
    if (result?.content) {
      hapticFeedback('medium')
      setStatus('processing')
      
      try {
        // Parse QR content - it should be a URL with session parameter
        const url = new URL(result.content)
        const session = url.searchParams.get('session')
        
        if (!session) {
          throw new Error('QR code invalido')
        }
        
        setSessionId(session)
        
        // Mark as scanned
        const response = await fetch('/api/auth/qr/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session,
            action: 'scan',
          }),
        })
        
        const data = await response.json()
        
        if (data.success) {
          setDeviceInfo(data.deviceInfo || 'Dispositivo desconhecido')
          setStatus('confirming')
        } else {
          throw new Error(data.error || 'Sessao invalida')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao processar QR code')
        setStatus('error')
        hapticFeedback('heavy')
      }
    }
  }, [isCapacitor, scanQRCode, hapticFeedback])

  // Confirm login
  const confirmLogin = async () => {
    if (!sessionId || !user) return
    
    setStatus('processing')
    
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
        hapticFeedback('medium')
        setStatus('success')
        
        setTimeout(() => {
          onClose?.()
        }, 2000)
      } else {
        throw new Error(data.error || 'Erro ao confirmar')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao confirmar login')
      setStatus('error')
      hapticFeedback('heavy')
    }
  }

  // Deny login
  const denyLogin = async () => {
    if (!sessionId) return
    
    try {
      await fetch('/api/auth/qr/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'deny',
        }),
      })
    } catch {
      // Ignore errors
    }
    
    hapticFeedback('light')
    onClose?.()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [stopScanning])

  if (!isAuthenticated) {
    return (
      <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
        <CardContent className="py-8 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white font-medium">Voce precisa estar logado</p>
          <p className="text-white/60 text-sm">Faca login primeiro para escanear QR codes</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
              <Scan className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-white">Scanner QR</CardTitle>
              <CardDescription className="text-white/60">
                Escaneie para fazer login em outro dispositivo
              </CardDescription>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center">
                <Camera className="w-12 h-12 text-cyan-400" />
              </div>
              
              <p className="text-white/60 text-sm mb-6">
                Aponte a camera para o QR code exibido no computador ou outro dispositivo
              </p>
              
              <Button
                onClick={startScan}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                <Scan className="w-5 h-5 mr-2" />
                Iniciar Scanner
              </Button>
            </motion.div>
          )}
          
          {status === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-white/5 border border-cyan-500/50 flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent"
                  animate={{ y: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Scan className="w-12 h-12 text-cyan-400 animate-pulse" />
              </div>
              
              <p className="text-white font-medium mb-2">Escaneando...</p>
              <p className="text-white/60 text-sm">Posicione o QR code na area de captura</p>
              
              <Button
                variant="outline"
                onClick={() => {
                  stopScanning()
                  setStatus('idle')
                }}
                className="mt-6 border-white/20 text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
            </motion.div>
          )}
          
          {status === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <Loader2 className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
              <p className="text-white font-medium">Processando...</p>
            </motion.div>
          )}
          
          {status === 'confirming' && (
            <motion.div
              key="confirming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10">
                    <Smartphone className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Dispositivo solicitante</p>
                    <p className="text-white/60 text-sm">{deviceInfo}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-white/80 text-sm">
                    Apenas confirme se voce iniciou este login. Nao compartilhe seu acesso.
                  </p>
                </div>
              </div>
              
              <div className="text-center py-2">
                <p className="text-white/60 text-sm">Conectando como:</p>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={denyLogin}
                  className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Negar
                </Button>
                
                <Button
                  onClick={confirmLogin}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Autorizar
                </Button>
              </div>
            </motion.div>
          )}
          
          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              </motion.div>
              <p className="text-white font-semibold text-lg">Login Autorizado!</p>
              <p className="text-white/60 text-sm">O dispositivo foi conectado com sucesso</p>
            </motion.div>
          )}
          
          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-white font-semibold">Erro</p>
              <p className="text-white/60 text-sm">{error}</p>
              
              <Button
                onClick={() => setStatus('idle')}
                variant="outline"
                className="mt-6 border-white/20 text-white hover:bg-white/10"
              >
                Tentar Novamente
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
