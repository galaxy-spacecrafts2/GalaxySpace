'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  CameraOff,
  QrCode,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Shield,
  Smartphone,
  Mail,
  AlertTriangle,
  Scan,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { isNativeApp } from '@/lib/utils/mobile-detection'
import {
  checkCameraPermission,
  requestCameraPermission,
} from '@/lib/utils/camera-permissions'

type ScanStatus = 'idle' | 'scanning' | 'found' | 'confirming' | 'success' | 'error'

export function MobileQRScanner() {
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const [status, setStatus] = useState<ScanStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [isNative, setIsNative] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const router = useRouter()

  useEffect(() => {
    setIsNative(isNativeApp())
    checkCameraStatus()
    return () => stopCamera()
  }, [])

  const checkCameraStatus = async () => {
    try {
      const result = await checkCameraPermission()
      const mapped =
        result.state === 'granted' ? 'granted'
        : result.state === 'denied' ? 'denied'
        : 'prompt'
      setCameraPermission(mapped)
    } catch {
      setCameraPermission('prompt')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  const startCamera = async () => {
    setError(null)
    try {
      const permResult = await checkCameraPermission()
      if (!permResult.granted) {
        const reqResult = await requestCameraPermission()
        if (!reqResult.granted) {
          setCameraPermission('denied')
          setError('Permissao da camera negada. Habilite nas configuracoes do dispositivo.')
          return
        }
      }
      setCameraPermission('granted')
      setStatus('scanning')

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera error:', err)
      setCameraPermission('denied')
      setError('Erro ao iniciar a camera')
      setStatus('error')
    }
  }

  const handleManualQRInput = async (qrValue: string) => {
    stopCamera()
    setStatus('found')

    try {
      let sessionId: string | null = null

      if (qrValue.includes('/auth/qr-confirm?session=')) {
        const url = new URL(qrValue)
        sessionId = url.searchParams.get('session')
      } else if (qrValue.length === 64) {
        sessionId = qrValue
      }

      if (!sessionId) {
        setStatus('error')
        setError('QR code invalido ou nao reconhecido')
        return
      }

      await new Promise(r => setTimeout(r, 800))
      setStatus('confirming')

      router.push(`/auth/qr-confirm?session=${sessionId}`)
    } catch {
      setStatus('error')
      setError('Erro ao processar QR code')
    }
  }

  const simulateScan = () => {
    setStatus('found')
    setTimeout(() => {
      setStatus('success')
      setTimeout(() => router.push('/community'), 1500)
    }, 1500)
  }

  const reset = () => {
    stopCamera()
    setStatus('idle')
    setError(null)
    setCameraPermission('prompt')
    checkCameraStatus()
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { stopCamera(); router.back() }}
          className="text-white/60 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-cyan-400" />
          <span className="text-white/80 text-sm font-medium">Scanner QR</span>
        </div>

        <div className="w-20" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 border-white/10 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                <QrCode className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Scanner QR Code</CardTitle>
            <CardDescription className="text-white/60">
              Aponte para o QR code exibido no computador
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="relative">
              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {cameraPermission === 'denied' ? (
                      <div className="w-full h-64 bg-red-500/10 rounded-2xl border border-red-500/30 flex flex-col items-center justify-center px-6">
                        <CameraOff className="w-12 h-12 text-red-400 mb-4" />
                        <p className="text-white/80 text-sm mb-2 font-medium">Permissao Negada</p>
                        <p className="text-white/50 text-xs mb-4 text-center">
                          Habilite o acesso a camera nas configuracoes do dispositivo e tente novamente.
                        </p>
                        <Button onClick={reset} variant="outline" className="border-white/20 text-white hover:bg-white/10 text-sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Tentar Novamente
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center px-6">
                        <Camera className="w-12 h-12 text-white/60 mb-4" />
                        <p className="text-white/80 text-sm mb-2">Precisamos acessar sua camera</p>
                        <p className="text-white/50 text-xs mb-4 text-center">
                          Para escanear QR codes, precisamos de permissao para usar a camera do seu dispositivo.
                        </p>
                        <Button onClick={startCamera} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                          <Camera className="w-4 h-4 mr-2" />
                          Permitir Camera
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}

                {status === 'scanning' && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-64 rounded-2xl overflow-hidden border border-white/10"
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-48 h-48 border-2 border-cyan-400 rounded-2xl"
                        animate={{
                          boxShadow: [
                            '0 0 0 0 rgba(6, 182, 212, 0.7)',
                            '0 0 0 20px rgba(6, 182, 212, 0)',
                            '0 0 0 0 rgba(6, 182, 212, 0)',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <p className="text-white/80 text-xs">Posicione o QR code dentro da area</p>
                    </div>

                    <button
                      onClick={simulateScan}
                      className="absolute top-2 right-2 bg-black/60 text-white/60 text-xs px-2 py-1 rounded-lg border border-white/10 hover:text-white"
                    >
                      <Scan className="w-3 h-3 inline mr-1" />
                      Simular scan
                    </button>
                  </motion.div>
                )}

                {status === 'found' && (
                  <motion.div
                    key="found"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-64 bg-green-500/10 rounded-2xl border border-green-500/30 flex flex-col items-center justify-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                    <p className="text-white font-semibold text-lg">QR Code Encontrado!</p>
                    <p className="text-white/60 text-sm">Confirmando acesso...</p>
                  </motion.div>
                )}

                {status === 'confirming' && (
                  <motion.div
                    key="confirming"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-64 bg-yellow-500/10 rounded-2xl border border-yellow-500/30 flex flex-col items-center justify-center"
                  >
                    <Shield className="w-16 h-16 text-yellow-400 mb-4 animate-pulse" />
                    <p className="text-white font-semibold text-lg">Confirmando Login</p>
                    <p className="text-white/60 text-sm">Aguarde um momento...</p>
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-64 bg-green-500/10 rounded-2xl border border-green-500/30 flex flex-col items-center justify-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                    <p className="text-white font-semibold text-lg">Login Confirmado!</p>
                    <p className="text-white/60 text-sm">Redirecionando...</p>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-64 bg-red-500/10 rounded-2xl border border-red-500/30 flex flex-col items-center justify-center px-6"
                  >
                    <XCircle className="w-16 h-16 text-red-400 mb-4" />
                    <p className="text-white font-semibold mb-2">Erro</p>
                    <p className="text-white/60 text-sm text-center mb-4">{error}</p>
                    <Button onClick={reset} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Tentar Novamente
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {status === 'scanning' && (
              <div className="space-y-2">
                <p className="text-white/50 text-xs text-center">Ou cole o link do QR code:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cole a URL do QR code aqui..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleManualQRInput((e.target as HTMLInputElement).value)
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs"
                    onClick={(e) => {
                      const input = (e.currentTarget.previousSibling as HTMLInputElement)
                      handleManualQRInput(input.value)
                    }}
                  >
                    OK
                  </Button>
                </div>
              </div>
            )}

            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-white/60 text-sm mb-3">Ou faca login com:</p>
              <Button
                onClick={() => { stopCamera(); router.push('/auth/login') }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email e Senha
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-white/40 text-xs pt-2">
              <Smartphone className="w-3 h-3" />
              <span>{isNative ? 'App Nativo' : 'Mobile Web'} Ativado</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
