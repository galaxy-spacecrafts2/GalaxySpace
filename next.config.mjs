/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_PUBLIC_PLATFORM === 'mobile' ? 'export' : undefined,
  distDir: process.env.NEXT_PUBLIC_PLATFORM === 'mobile' ? 'out' : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: process.env.NEXT_PUBLIC_PLATFORM === 'mobile' ? true : false,
    formats: process.env.NEXT_PUBLIC_PLATFORM === 'mobile' ? [] : ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Disable features not compatible with static export
  trailingSlash: process.env.NEXT_PUBLIC_PLATFORM === 'mobile' ? true : false,
  // Skip API routes for static export
  excludeDefaultMomentLocales: true,
  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-icons',
      'react-redux',
      '@reduxjs/toolkit'
    ],
    scrollRestoration: true,
  },
  // Define environment variables for mobile builds
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://galaxy-spacecrafts.vercel.app',
    NEXT_PUBLIC_PLATFORM: process.env.NEXT_PUBLIC_PLATFORM || 'web',
  },
  // Turbopack configuration for mobile builds
  ...(process.env.NEXT_PUBLIC_PLATFORM === 'mobile' && {
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    webpack: (config, { isServer }) => {
      // Optimize bundle size for mobile
      if (!isServer) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 10,
              },
              components: {
                test: /[\\/]components[\\/]/,
                name: 'components',
                chunks: 'all',
                priority: 20,
              },
              lib: {
                test: /[\\/]lib[\\/]/,
                name: 'lib',
                chunks: 'all',
                priority: 30,
              },
            },
          },
        }
      }
      return config
    },
  }),
}

export default nextConfig
