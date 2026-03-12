'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Mail, 
  QrCode, 
  UserPlus, 
  Rocket,
  Shield,
  Smartphone,
  Monitor
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SpaceBackground } from '@/components/ui/space-background'
import { useAppSelector } from '@/lib/store/hooks'

export default function MobilePage() {
  const [isMobile, setIsMobile] = useState(false)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  
  useEffect(() => {
    setIsMobile(typeof window !== 'undefined' && window.innerWidth < 1024)
  }, [])
  
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 border-white/10 backdrop-blur-xl">
          <CardHeader className="text-center">
            <Rocket className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-white">Bem-vindo!</CardTitle>
            <CardDescription className="text-white/60">
              Você já está logado como astronauta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/community">
              <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                Ir para a Comunidade
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Painel de Controle
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <SpaceBackground showMeteors showBeams>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-white/5 border border-white/10">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-white/70">GALAXY.SPACECRAFTS</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              GALAXY.SPACECRAFTS
            </h1>
            <p className="text-sm text-white/50 font-mono">
              Portal do Astronauta
            </p>
          </motion.div>
          
          {/* Login Options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Email Login */}
            <Link href="/auth/login">
              <Card className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-black/40 border-white/10 backdrop-blur-xl hover:border-white/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">Login com Email</h3>
                    <p className="text-white/60 text-sm">Use seu email e senha</p>
                  </div>
                  <div className="text-white/40 group-hover:text-white/60 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* QR Code Options */}
            {isMobile ? (
              // Mobile: Show QR Scanner
              <Link href="/auth/qr-scan">
                <Card className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-black/40 border-white/10 backdrop-blur-xl hover:border-white/20">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
                      <QrCode className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">Escanear QR Code</h3>
                      <p className="text-white/60 text-sm">Use a câmera do celular</p>
                    </div>
                    <div className="text-white/40 group-hover:text-white/60 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              // Desktop: Show QR Display
              <Link href="/auth/login?method=qr">
                <Card className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-black/40 border-white/10 backdrop-blur-xl hover:border-white/20">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
                      <QrCode className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">Login com QR Code</h3>
                      <p className="text-white/60 text-sm">Escaneie com o celular</p>
                    </div>
                    <div className="text-white/40 group-hover:text-white/60 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}
            
            {/* Sign Up */}
            <Link href="/auth/sign-up">
              <Card className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-black/40 border-white/10 backdrop-blur-xl hover:border-white/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/10">
                    <UserPlus className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">Criar Conta</h3>
                    <p className="text-white/60 text-sm">Cadastre-se como astronauta</p>
                  </div>
                  <div className="text-white/40 group-hover:text-white/60 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          
          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-white/60">Conexão Segura</span>
            </div>
            <p className="text-white/40 text-xs mt-2 font-mono">
              {isMobile ? (
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  Modo Mobile Ativado
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Monitor className="w-3 h-3" />
                  Modo Desktop Ativado
                </span>
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </SpaceBackground>
  )
}
