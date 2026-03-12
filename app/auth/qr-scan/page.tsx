'use client'

import { Suspense } from 'react'
import { MobileQRScanner } from '@/components/auth/mobile-qr-scanner'

export default function QRScanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <MobileQRScanner />
    </Suspense>
  )
}
