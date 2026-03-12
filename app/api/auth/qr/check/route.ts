import { NextRequest, NextResponse } from 'next/server'
import { qrSessions } from '@/lib/store/qr-sessions'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID obrigatório' },
        { status: 400 }
      )
    }

    const session = qrSessions.get(sessionId)

    if (!session) {
      return NextResponse.json({ status: 'not_found', remainingTime: 0 })
    }

    const now = Date.now()
    const remainingTime = Math.max(0, session.expiresAt - now)

    if (remainingTime === 0) {
      qrSessions.delete(sessionId)
      return NextResponse.json({ status: 'expired', remainingTime: 0 })
    }

    return NextResponse.json({
      status: session.status,
      remainingTime,
      token: session.token,
      user: session.user,
    })
  } catch (error) {
    console.error('QR check error:', error)
    return NextResponse.json(
      { success: false, error: 'Falha ao verificar QR' },
      { status: 500 }
    )
  }
}
