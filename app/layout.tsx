import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import { Providers } from './providers'
import './globals.css'

// Optimize font loading with display: swap
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
  preload: true
});
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: 'Galaxy.SpaceCrafts | Mission Control',
  description: 'Advanced rocket telemetry and control interface for Galaxy.SpaceCrafts. Real-time LoRa data, tutorials, and documentation.',
  generator: 'v0.app',
  keywords: ['rocket', 'space', 'telemetry', 'LoRa', 'spacecraft', 'mission control'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Galaxy.SC',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>
          <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          }>
            {children}
          </Suspense>
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
