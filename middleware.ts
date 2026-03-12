import { NextResponse, type NextRequest } from 'next/server'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const userAgent = request.headers.get('user-agent') || ''
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'

  // RATE LIMITING - DDoS protection
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 100

  const rateLimitData = rateLimitStore.get(ip)

  if (rateLimitData && rateLimitData.resetTime > now) {
    if (rateLimitData.count >= maxRequests) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '900',
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitData.resetTime.toString()
        }
      })
    }
    rateLimitData.count++
  } else {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
  }

  // USER-AGENT VALIDATION - Bot protection
  const suspiciousPatterns = [
    /sqlmap/i, /nmap/i, /metasploit/i, /burp/i
  ]

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent))
  if (isSuspicious) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // ATTACK DETECTION
  const queryString = url.search + url.pathname
  const sqlInjectionPatterns = [
    /('|(\')|(;|(;))|(\%27)|(\%3B))/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
  ]

  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
  ]

  const hasSQLInjection = sqlInjectionPatterns.some(pattern => pattern.test(queryString))
  const hasXSS = xssPatterns.some(pattern => pattern.test(queryString))

  if (hasSQLInjection || hasXSS) {
    console.warn(`Security Alert: ${hasSQLInjection ? 'SQL Injection' : 'XSS'} attempt from IP: ${ip}`)
    return new NextResponse('Attack Detected', { status: 403 })
  }

  // SECURITY HEADERS
  const response = NextResponse.next()

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=()'
  )
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')

  // CSP - updated to support Replit and Supabase
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.replit.dev https://*.repl.co https://*.replit.app",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://*.supabase.co https://*.replit.dev https://*.repl.co",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.replit.dev https://*.repl.co wss://*.repl.co https://*.replit.app",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  // CORS - allow Replit domains and localhost for development
  const origin = request.headers.get('origin')
  const isReplitOrigin = origin && (
    origin.includes('.replit.dev') ||
    origin.includes('.repl.co') ||
    origin.includes('.replit.app') ||
    origin === 'http://localhost:3000' ||
    origin === 'http://localhost:5000' ||
    origin === 'https://localhost:3000' ||
    origin === 'https://localhost:5000'
  )

  if (origin) {
    if (isReplitOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    } else {
      return new NextResponse('CORS Policy Violation', { status: 403 })
    }
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Access-Control-Allow-Credentials', 'false')
  response.headers.set('Access-Control-Max-Age', '86400')

  // Mobile redirect logic
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)
  const isTablet = /iPad|Tablet/.test(userAgent)
  const isCapacitor = request.headers.get('x-capacitor-platform') === 'android'
  const isMobilePlatform = process.env.NEXT_PUBLIC_PLATFORM === 'mobile' || isCapacitor

  if (
    (isMobile || isTablet || isMobilePlatform) &&
    (url.pathname === '/' || url.pathname === '/mobile') &&
    !url.pathname.startsWith('/auth') &&
    !url.pathname.startsWith('/api')
  ) {
    url.pathname = '/auth/qr-scan'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|manifest\\.json|icons/|apple-icon\\.png|icon\\.svg|icon-light-32x32\\.png|icon-dark-32x32\\.png|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
