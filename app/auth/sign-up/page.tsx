'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { signUpUser } from '@/lib/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Mail, Lock, User, ArrowRight, AlertCircle, Sparkles,
  Shield, Eye, EyeOff, CheckCircle2, XCircle
} from 'lucide-react'
import { signupSchema } from '@/lib/validations'
import { signUp as betterAuthSignUp } from '@/lib/auth/auth-client'
import { SpaceBackground, BorderSnakeBeam } from '@/components/ui/space-background'
import { RobotMascot } from '@/components/auth/robot-mascot'
import { SuccessOverlay } from '@/components/auth/success-overlay'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Minimo 8 caracteres', valid: password.length >= 8 },
    { label: 'Letra maiuscula', valid: /[A-Z]/.test(password) },
    { label: 'Letra minuscula', valid: /[a-z]/.test(password) },
    { label: 'Numero', valid: /[0-9]/.test(password) },
  ]
  if (!password) return null
  return (
    <div className="mt-2 space-y-1">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-2 text-xs">
          {c.valid
            ? <CheckCircle2 className="w-3 h-3 text-green-400" />
            : <XCircle className="w-3 h-3 text-white/30" />}
          <span className={c.valid ? 'text-green-400' : 'text-white/40'}>{c.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState<'username' | 'email' | 'password' | 'confirmPassword' | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const router = useRouter()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setValidationErrors({})

    const result = signupSchema.safeParse({
      name: username,
      email,
      username,
      password,
      confirmPassword,
    })

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
      const authResult = await betterAuthSignUp.email({
        email: result.data.email,
        password: result.data.password,
        name: result.data.name,
      })

      if (authResult.error) {
        const action = await dispatch(signUpUser({ email, password, username }))
        if (signUpUser.fulfilled.match(action)) {
          setShowSuccess(true)
        }
      } else {
        setShowSuccess(true)
      }
    } catch {
      const action = await dispatch(signUpUser({ email, password, username }))
      if (signUpUser.fulfilled.match(action)) {
        setShowSuccess(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccessComplete = () => {
    router.push('/auth/sign-up-success')
    router.refresh()
  }

  const getTrackingValue = () => {
    if (focusedField === 'username') return username
    if (focusedField === 'email') return email
    return ''
  }

  return (
    <>
      <SuccessOverlay
        isVisible={showSuccess}
        message="Cadastro realizado!"
        onComplete={handleSuccessComplete}
      />

      <SpaceBackground showMeteors showBeams>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
          <div className="flex items-center gap-8 lg:gap-16 max-w-5xl w-full relative z-10">

            <motion.div
              className="hidden lg:flex flex-col items-center justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <RobotMascot
                emailValue={getTrackingValue()}
                focusedField={focusedField === 'password' || focusedField === 'confirmPassword' ? 'password' : focusedField === 'email' ? 'email' : null}
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
                  {focusedField === 'password' || focusedField === 'confirmPassword'
                    ? 'Privacidade garantida!'
                    : 'Pronto para decolar?'}
                </p>
              </motion.div>

              <div className="mt-6 space-y-3">
                {[
                  { icon: Shield, text: 'Acesso seguro' },
                  { icon: CheckCircle2, text: 'Conta protegida' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/60">
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-mono">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-md mx-auto"
            >
              <BorderSnakeBeam beamColor="cyan" duration={6}>
                <div className="rounded-xl p-8 backdrop-blur-xl border border-white/10 bg-black/80">
                  <div className="relative text-center mb-8">
                    <motion.div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-white/5 border border-white/10"
                      animate={{ boxShadow: ['0 0 20px rgba(255,255,255,0.1)', '0 0 30px rgba(255,255,255,0.15)', '0 0 20px rgba(255,255,255,0.1)'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Sparkles className="w-4 h-4 text-white/70" />
                      <span className="text-xs font-mono text-white/70">NOVA MISSAO</span>
                    </motion.div>

                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                      JUNTE-SE A MISSAO
                    </h1>
                    <p className="text-sm text-white/50 font-mono">
                      Crie sua conta de astronauta
                    </p>
                  </div>

                  <form onSubmit={handleSignUp} className="relative space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <User className="h-4 w-4 text-white/60" />
                        Nome de usuario
                      </Label>
                      <Input
                        id="username"
                        placeholder="astronauta_42"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value)
                          if (validationErrors.username) setValidationErrors(prev => ({ ...prev, username: '' }))
                        }}
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField(null)}
                        className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/50 h-12 ${validationErrors.username ? 'border-red-500/50' : ''}`}
                      />
                      {validationErrors.username && (
                        <p className="text-xs text-red-400">{validationErrors.username}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-white/60" />
                        Email
                      </Label>
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
                        className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/50 h-12 ${validationErrors.email ? 'border-red-500/50' : ''}`}
                      />
                      {validationErrors.email && (
                        <p className="text-xs text-red-400">{validationErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-white/60" />
                        Senha
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Minimo 8 caracteres"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: '' }))
                          }}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/50 h-12 pr-10 ${validationErrors.password ? 'border-red-500/50' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <PasswordStrength password={password} />
                      {validationErrors.password && (
                        <p className="text-xs text-red-400">{validationErrors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-white/60" />
                        Confirmar Senha
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repita a senha"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            if (validationErrors.confirmPassword) setValidationErrors(prev => ({ ...prev, confirmPassword: '' }))
                          }}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField(null)}
                          className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/50 h-12 pr-10 ${validationErrors.confirmPassword ? 'border-red-500/50' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {validationErrors.confirmPassword && (
                        <p className="text-xs text-red-400">{validationErrors.confirmPassword}</p>
                      )}
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
                          Criar Conta
                          <ArrowRight className="h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-white/50">
                      Ja tem uma conta?{' '}
                      <Link
                        href="/auth/login"
                        className="text-white hover:text-white/80 font-medium transition-colors underline underline-offset-2"
                      >
                        Fazer login
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
                      CADASTRO SEGURO v3.0
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
