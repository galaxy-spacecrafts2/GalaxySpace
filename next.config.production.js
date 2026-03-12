/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações de segurança de produção
  reactStrictMode: true,
  swcMinify: true,
  
  // Otimização de imagens com segurança
  images: {
    domains: [
      'your-domain.com',
      'cdn.your-domain.com',
      'vercel.app'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Headers de segurança personalizados
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Headers básicos de segurança
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), interest-cohort=()'
          },
          
          // Headers avançados de segurança
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          },
          
          // Headers anti-bot
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, nosnippet, noarchive'
          },
          {
            key: 'Server',
            value: '' // Ocultar informações do servidor
          },
          
          // Cache control para segurança
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      },
      
      // Headers específicos para API routes
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'none'; object-src 'none'; base-uri 'self';"
          }
        ]
      },
      
      // Headers para arquivos estáticos
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      
      // Headers para manifest.json
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400'
          },
          {
            key: 'Content-Type',
            value: 'application/manifest+json'
          }
        ]
      }
    ]
  },
  
  // CSP (Content Security Policy) rigoroso
  async contentSecurityPolicy() {
    const isDev = process.env.NODE_ENV === 'development'
    
    return {
      extension: {
        scriptSrc: [
          "'self'",
          isDev && "'unsafe-eval'",
          "'unsafe-inline'",
          'https://vercel.live',
          'https://*.vercel.app'
        ].filter(Boolean),
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com'
        ],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.vercel.app'
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com'
        ],
        connectSrc: [
          "'self'",
          'https://*.vercel.app',
          'wss://*.vercel.app'
        ],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: []
      }
    }
  },
  
  // Redirecionamentos de segurança
  async redirects() {
    return [
      // Forçar HTTPS em produção
      process.env.NODE_ENV === 'production' && {
        source: '/:path((?!_next/static|_next/image|api).*)',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http'
          }
        ],
        destination: 'https://your-domain.com/:path*',
        permanent: true
      },
      
      // Redirecionar www para não-www
      {
        source: '/:path((?!_next/static|_next/image|api).*)',
        has: [
          {
            type: 'header',
            key: 'host',
            value: 'www.your-domain.com'
          }
        ],
        destination: 'https://your-domain.com/:path*',
        permanent: true
      }
    ].filter(Boolean)
  },
  
  // Rewrites para segurança
  async rewrites() {
    return [
      // Ocultar endpoints sensíveis
      {
        source: '/admin/:path*',
        destination: '/api/404'
      },
      {
        source: '/.well-known/:path*',
        destination: '/api/404'
      }
    ]
  },
  
  // Configurações de build otimizadas
  webpack: (config, { dev, isServer }) => {
    // Otimizações de segurança no webpack
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        }
      }
    }
    
    // Remover informações sensíveis do build
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false
    }
    
    return config
  },
  
  // Configurações de experimento (seguras)
  experimental: {
    // Otimizações de performance
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      'framer-motion'
    ],
    
    // Security features
    serverComponentsExternalPackages: [
      'bcryptjs',
      'better-auth'
    ]
  },
  
  // Configurações de output para produção
  output: 'standalone',
  
  // Configurações de compressão
  compress: true,
  
  // Power by header removido
  poweredByHeader: false,
  
  // Trailing slash para SEO e segurança
  trailingSlash: false,
  
  // Configurações de i18n (se necessário)
  i18n: {
    locales: ['pt-BR', 'en'],
    defaultLocale: 'pt-BR',
    localeDetection: false
  },
  
  // Configurações de analytics (se usado)
  analyticsId: process.env.VERCEL_ANALYTICS_ID,
  
  // Configurações de distDir
  distDir: '.next',
  
  // Configurações de página estática
  generateEtags: true,
  
  // Configurações de HTTP
  httpAgentOptions: {
    keepAlive: true
  }
}

module.exports = nextConfig
