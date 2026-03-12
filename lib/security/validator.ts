import { z } from 'zod'

// Regex patterns para validação de segurança
const SECURITY_PATTERNS = {
  // SQL Injection patterns
  SQL_INJECTION: [
    /('|(\')|(;|(;))|(\%27)|(\%3B))/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /UNION[^a-zA-Z]/i,
    /SELECT[^a-zA-Z]/i,
    /INSERT[^a-zA-Z]/i,
    /DELETE[^a-zA-Z]/i,
    /UPDATE[^a-zA-Z]/i,
    /DROP[^a-zA-Z]/i,
    /CREATE[^a-zA-Z]/i,
    /ALTER[^a-zA-Z]/i,
    /TRUNCATE[^a-zA-Z]/i
  ],
  
  // XSS patterns
  XSS: [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
    /<img[^>]*>/gi,
    /<svg[^>]*>/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /onmouseover\s*=/gi
  ],
  
  // Command injection patterns
  COMMAND_INJECTION: [
    /;\s*(rm|del|format|fdisk|mkfs|shutdown|reboot|halt|poweroff)\s/i,
    /[;&|`$(){}[\]]/,
    /\|\s*(cat|ls|dir|type|more|less|head|tail)\s/i,
    /&&\s*(rm|del|format|shutdown|reboot)\s/i,
    /`[^`]*`/,
    /\$\([^)]*\)/,
    /\${[^}]*}/
  ],
  
  // Path traversal patterns
  PATH_TRAVERSAL: [
    /\.\.[\/\\]/,
    /%2e%2e[\/\\]/i,
    /\.\.%2f/i,
    /\.\.%5c/i,
    /%2e%2e%2f/i,
    /%2e%2e%5c/i
  ],
  
  // LDAP injection patterns
  LDAP_INJECTION: [
    /\*\)/,
    /\)\(/,
    /\*\(/,
    /[&|!<>]=/,
    /[\(\)]*[&|!<>]=/,
    /[&|!<>][\(\)]*/
  ]
}

// Função de sanitização de strings
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  return input
    .trim()
    // Remove caracteres de controle
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove tags HTML
    .replace(/<[^>]*>/g, '')
    // Remove caracteres especiais perigosos
    .replace(/[<>'"&]/g, '')
    // Limita tamanho
    .substring(0, 1000)
}

// Função de validação de segurança
export function validateSecurity(input: string): { isValid: boolean; threats: string[] } {
  const threats: string[] = []
  
  if (!input || typeof input !== 'string') {
    return { isValid: false, threats: ['Invalid input type'] }
  }
  
  // Check SQL Injection
  if (SECURITY_PATTERNS.SQL_INJECTION.some(pattern => pattern.test(input))) {
    threats.push('SQL Injection detected')
  }
  
  // Check XSS
  if (SECURITY_PATTERNS.XSS.some(pattern => pattern.test(input))) {
    threats.push('XSS detected')
  }
  
  // Check Command Injection
  if (SECURITY_PATTERNS.COMMAND_INJECTION.some(pattern => pattern.test(input))) {
    threats.push('Command Injection detected')
  }
  
  // Check Path Traversal
  if (SECURITY_PATTERNS.PATH_TRAVERSAL.some(pattern => pattern.test(input))) {
    threats.push('Path Traversal detected')
  }
  
  // Check LDAP Injection
  if (SECURITY_PATTERNS.LDAP_INJECTION.some(pattern => pattern.test(input))) {
    threats.push('LDAP Injection detected')
  }
  
  return {
    isValid: threats.length === 0,
    threats
  }
}

// Schemas de validação Zod com segurança

export const secureEmailSchema = z.string()
  .min(1, 'Email é obrigatório')
  .max(254, 'Email muito longo')
  .email('Email inválido')
  .refine((email) => {
    const validation = validateSecurity(email)
    if (!validation.isValid) {
      console.warn(`🚨 Security threat in email: ${validation.threats.join(', ')}`)
      return false
    }
    return true
  }, 'Email contém conteúdo suspeito')
  .transform(sanitizeString)

export const securePasswordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(128, 'Senha muito longa')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial')
  .refine((password) => {
    const validation = validateSecurity(password)
    if (!validation.isValid) {
      console.warn(`🚨 Security threat in password: ${validation.threats.join(', ')}`)
      return false
    }
    return true
  }, 'Senha contém conteúdo suspeito')

export const secureNameSchema = z.string()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(100, 'Nome muito longo')
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras')
  .refine((name) => {
    const validation = validateSecurity(name)
    if (!validation.isValid) {
      console.warn(`🚨 Security threat in name: ${validation.threats.join(', ')}`)
      return false
    }
    return true
  }, 'Nome contém conteúdo suspeito')
  .transform(sanitizeString)

export const secureMessageSchema = z.string()
  .min(1, 'Mensagem é obrigatória')
  .max(1000, 'Mensagem muito longa')
  .refine((message) => {
    const validation = validateSecurity(message)
    if (!validation.isValid) {
      console.warn(`🚨 Security threat in message: ${validation.threats.join(', ')}`)
      return false
    }
    return true
  }, 'Mensagem contém conteúdo suspeito')
  .transform(sanitizeString)

// Schema completo de registro
export const secureRegisterSchema = z.object({
  email: secureEmailSchema,
  password: securePasswordSchema,
  name: secureNameSchema
})

// Schema completo de login
export const secureLoginSchema = z.object({
  email: secureEmailSchema,
  password: z.string().min(1, 'Senha é obrigatória')
})

// Schema para QR code
export const secureQRSchema = z.object({
  qrData: z.string()
    .min(1, 'Dados do QR são obrigatórios')
    .max(500, 'Dados do QR muito longos')
    .refine((data) => {
      const validation = validateSecurity(data)
      if (!validation.isValid) {
        console.warn(`🚨 Security threat in QR data: ${validation.threats.join(', ')}`)
        return false
      }
      return true
    }, 'Dados do QR contêm conteúdo suspeito')
    .transform(sanitizeString)
})

// Função para validação de CSRF tokens
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) {
    return false
  }
  
  // Em produção, use um token HMAC ou similar
  // Por enquanto, uma validação simples
  return token.length === sessionToken.length && 
         token.startsWith(sessionToken.substring(0, 10))
}

// Função para rate limiting por usuário
const userRateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkUserRateLimit(userId: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const userData = userRateLimitStore.get(userId)
  
  if (userData && userData.resetTime > now) {
    if (userData.count >= maxRequests) {
      return false
    }
    userData.count++
  } else {
    userRateLimitStore.set(userId, { count: 1, resetTime: now + windowMs })
  }
  
  return true
}

// Função para detectar comportamento suspeito
export function detectSuspiciousActivity(data: {
  userAgent?: string
  ip?: string
  requestCount?: number
  timeWindow?: number
}): { isSuspicious: boolean; reasons: string[] } {
  const reasons: string[] = []
  
  // Check request frequency
  if (data.requestCount && data.timeWindow) {
    const requestsPerMinute = (data.requestCount / data.timeWindow) * 60000
    if (requestsPerMinute > 60) { // Mais de 60 requisições por minuto
      reasons.push('High request frequency')
    }
  }
  
  // Check user agent
  if (data.userAgent) {
    const suspiciousUA = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /curl/i, /wget/i, /python/i, /java/i, /perl/i,
      /sqlmap/i, /nmap/i, /metasploit/i, /burp/i
    ]
    
    if (suspiciousUA.some(pattern => pattern.test(data.userAgent!))) {
      reasons.push('Suspicious user agent')
    }
  }
  
  return {
    isSuspicious: reasons.length > 0,
    reasons
  }
}

export type SecurityValidationResult = {
  isValid: boolean
  threats: string[]
  sanitizedData?: any
}

// Função principal de validação de formulários
export function validateFormData<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): SecurityValidationResult {
  try {
    const validatedData = schema.parse(data)
    return {
      isValid: true,
      threats: [],
      sanitizedData: validatedData
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const threats = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return {
        isValid: false,
        threats
      }
    }
    
    return {
      isValid: false,
      threats: ['Unknown validation error']
    }
  }
}
