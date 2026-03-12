'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { loginUser, clearError } from '@/lib/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles, QrCode } from 'lucide-react'
import { QRLogin } from '@/components/auth/qr-login'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loginSchema } from '@/lib/validations'
import { signIn } from '@/lib/auth/auth-client'
import { SpaceBackground, BorderSnakeBeam } from '@/components/ui/space-background'
import { RobotMascot } from '@/components/auth/robot-mascot'
import { SuccessOverlay } from '@/components/auth/success-overlay'
import { isMobileDevice, isNativeApp } from '@/lib/utils/mobile-detection'

function LoginContent() {
  const searchParams = useSearchParams()
  const defaultMethod = searchParams.get('method') === 'qr' ? 'qr' : 'email'

  const [isMobile, setIsMobile] = useState(false)
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
    setIsNative(isNativeApp())
  }, [])

  const effectiveDefaultMethod = (isMobile || isNative) ? 'qr' : defaultMethod

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'email' | 'qr'>(effectiveDefaultMethod)

  const dispatch = useAppDispatch()
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !showSuccess) {
      setShowSuccess(true)
    }
  }, [isAuthenticated, showSuccess])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setValidationErrors({})

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message
      })
      setValidationErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      const authResult = await signIn.email({
        email: result.data.email,
        password: result.data.password,
      })

      if (authResult.error) {
        dispatch(loginUser({ email, password }))
      } else {
        setShowSuccess(true)
      }
    } catch {
      dispatch(loginUser({ email, password }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccessComplete = () => {
    router.push('/community')
    router.refresh()
  }

  return (
    <>
      <SuccessOverlay
        isVisible={showSuccess}
        message="Bem-vindo de volta!"
        onComplete={handleSuccessComplete}
      />

      <SpaceBackground showMeteors showBeams>
        <div className="min-h-screen flex items-center justify-center p-4 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white"
                style={{
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [
                    Math.cos((i / 5) * Math.PI * 2) * 300,
                    Math.cos((i / 5) * Math.PI * 2 + Math.PI) * 300,
                    Math.cos((i / 5) * Math.PI * 2 + Math.PI * 2) * 300,
                  ],
                  y: [
                    Math.sin((i / 5) * Math.PI * 2) * 300,
                    Math.sin((i / 5) * Math.PI * 2 + Math.PI) * 300,
                    Math.sin((i / 5) * Math.PI * 2 + Math.PI * 2) * 300,
                  ],
                }}
                transition={{ duration: 20 + i * 2, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </div>

          <div className="flex items-center gap-8 lg:gap-16 max-w-5xl w-full relative z-10">
            {loginMethod === 'email' && (
              <motion.div
                className="hidden lg:flex flex-col items-center justify-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <RobotMascot
                  emailValue={email}
                  focusedField={focusedField}
                  isSuccess={showSuccess}
                  isError={!!error}
                  isLoading={isLoading}
                />

                <motion.div
                  className="mt-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 max-w-[200px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-xs text-white/70 text-center font-mono">
                    {focusedField === 'password'
                      ? 'Nao estou olhando!'
                      : focusedField === 'email'
                      ? 'Continue digitando...'
                      : isLoading
                      ? 'Verificando credenciais...'
                      : showSuccess
                      ? 'Acesso autorizado!'
                      : error
                      ? 'Ops! Tente novamente.'
                      : 'Ola, astronauta!'}
                  </p>
                </motion.div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-md mx-auto"
            >
              <BorderSnakeBeam beamColor="cyan" duration={6}>
                <div className="rounded-xl p-8 backdrop-blur-xl border border-white/10 bg-black/80">
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full"
                      style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }} />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full"
                      style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
                  </div>

                  <div className="relative text-center mb-8">
                    <motion.div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-white/5 border border-white/10"
                      animate={{ boxShadow: ['0 0 20px rgba(255,255,255,0.1)', '0 0 30px rgba(255,255,255,0.15)', '0 0 20px rgba(255,255,255,0.1)'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Sparkles className="w-4 h-4 text-white/70" />
                      <span className="text-xs font-mono text-white/70">MISSION CONTROL</span>
                    </motion.div>

                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                      GALAXY.SPACECRAFTS
                    </h1>
                    <p className="text-sm text-white/50 font-mono">
                      Acesse o painel de controle da missao
                    </p>
                  </div>

                  <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as 'email' | 'qr')} className="mb-6">
                    <TabsList className="grid grid-cols-2 bg-white/5 w-full">
                      <TabsTrigger value="email" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="qr" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                        <QrCode className="w-4 h-4 mr-2" />
                        QR Code
                        {(isMobile || isNative) && (
                          <span className="ml-1 text-xs bg-cyan-500/20 px-1.5 py-0.5 rounded-full text-cyan-300">
                            Mobile
                          </span>
                        )}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {loginMethod === 'qr' ? (
                    <div className="py-4">
                      {isMobile || isNative ? (
                        <div className="text-center py-8">
                          <div className="mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 p-3 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                              <QrCode className="w-full h-full text-cyan-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                              Scanner QR Code Disponivel
                            </h3>
                            <p className="text-white/60 text-sm mb-6">
                              Use a camera do seu dispositivo para escanear o QR code do site desktop e fazer login instantaneamente.
                            </p>
                          </div>

                          <Button
                            onClick={() => router.push('/auth/qr-scan')}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white w-full h-12 text-base font-semibold"
                          >
                            <QrCode className="w-5 h-5 mr-2" />
                            Abrir Scanner QR Code
                          </Button>

                          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-xs text-white/50">
                              <strong>Como usar:</strong><br />
                              1. Acesse o site no computador<br />
                              2. Va para a pagina de login<br />
                              3. Clique em &quot;QR Code&quot;<br />
                              4. Escaneie o codigo com este dispositivo
                            </p>
                          </div>
                        </div>
                      ) : (
                        <QRLogin />
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="lg:hidden flex flex-col items-center mb-6">
                        <div className="scale-75">
                          <RobotMascot
                            emailValue={email}
                            focusedField={focusedField}
                            isSuccess={showSuccess}
                            isError={!!error}
                            isLoading={isLoading}
                          />
                        </div>
                      </div>

                      <form onSubmit={handleLogin} className="relative space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-white/80 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-white/60" />
                            Email
                          </Label>
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              placeholder="astronaut@galaxy.space"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value)
                                if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: '' }))
                              }}
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => setFocusedField(null)}
                              required
                              className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/50 focus:ring-white/20 transition-all h-12 ${validationErrors.email ? 'border-red-500/50' : ''}`}
                            />
                            {validationErrors.email && (
                              <p className="text-xs text-red-400 mt-1">{validationErrors.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium text-white/80 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-white/60" />
                            Senha
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type="password"
                              placeholder="Digite seu codigo de acesso"
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value)
                                if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: '' }))
                              }}
                              onFocus={() => setFocusedField('password')}
                              onBlur={() => setFocusedField(null)}
                              required
                              className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/50 focus:ring-white/20 transition-all h-12 ${validationErrors.password ? 'border-red-500/50' : ''}`}
                            />
                            {validationErrors.password && (
                              <p className="text-xs text-red-400 mt-1">{validationErrors.password}</p>
                            )}
                          </div>
                        </div>

                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: 'auto' }}
                              exit={{ opacity: 0, y: -10, height: 0 }}
                              className="flex items-center gap-2 p-3 bg-white/5 border border-white/20 rounded-lg"
                            >
                              <AlertCircle className="h-4 w-4 text-white/70 flex-shrink-0" />
                              <p className="text-sm text-white/70">{error}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Button
                          type="submit"
                          disabled={isLoading || isSubmitting}
                          className="w-full h-12 text-base font-semibold relative overflow-hidden group bg-white text-black hover:bg-white/90"
                        >
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)' }}
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                          />
                          {isLoading || isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full"
                            />
                          ) : (
                            <span className="relative flex items-center justify-center gap-2">
                              Iniciar Missao
                              <ArrowRight className="h-5 w-5" />
                            </span>
                          )}
                        </Button>
                      </form>
                    </>
                  )}

                  <div className="mt-6 text-center">
                    <p className="text-sm text-white/50">
                      Novo na missao?{' '}
                      <Link
                        href="/auth/sign-up"
                        className="text-white hover:text-white/80 font-medium transition-colors underline underline-offset-2"
                      >
                        Cadastre-se como astronauta
                      </Link>
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-center gap-2 text-xs text-white/40 font-mono">
                      <motion.span
                        className="w-2 h-2 rounded-full bg-white"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      SISTEMAS ONLINE
                      <span className="text-white/20">|</span>
                      PORTAL SEGURO v3.0
                    </div>
                  </div>
                </div>
              </BorderSnakeBeam>
            </motion.div>
          </div>
        </div>
      </SpaceBackground>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
