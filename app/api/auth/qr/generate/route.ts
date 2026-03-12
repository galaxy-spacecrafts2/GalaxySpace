import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { qrSessions, type QRSession } from '@/lib/store/qr-sessions'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { deviceInfo } = await request.json()

    const sessionId = randomBytes(32).toString('hex')
    const expiresAt = Date.now() + 5 * 60 * 1000
    const expiresIn = 300

    const origin = request.headers.get('origin') || `${request.nextUrl.protocol}//${request.nextUrl.host}`
    const authUrl = `${origin}/auth/qr-confirm?session=${sessionId}`

    const session: QRSession = {
      sessionId,
      qrData: sessionId,
      authUrl,
      expiresAt,
      expiresIn,
      status: 'pending',
      deviceInfo: deviceInfo || 'Dispositivo desconhecido',
    }

    qrSessions.set(sessionId, session)

    setTimeout(() => {
      qrSessions.delete(sessionId)
    }, 5 * 60 * 1000)

    return NextResponse.json({ success: true, ...session })
  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Falha ao gerar QR code' },
      { status: 500 }
    )
  }
}
