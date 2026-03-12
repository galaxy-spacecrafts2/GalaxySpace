import { NextRequest, NextResponse } from 'next/server'
import { qrSessions } from '@/lib/store/qr-sessions'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, action, userId, userEmail, userName } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID obrigatório' },
        { status: 400 }
      )
    }

    const session = qrSessions.get(sessionId)

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Sessão não encontrada' },
        { status: 404 }
      )
    }

    const now = Date.now()
    if (session.expiresAt < now) {
      qrSessions.delete(sessionId)
      return NextResponse.json(
        { success: false, error: 'QR code expirado' },
        { status: 410 }
      )
    }

    if (action === 'scan') {
      session.status = 'scanned'
      return NextResponse.json({
        success: true,
        deviceInfo: session.deviceInfo || 'Dispositivo desconhecido',
      })
    }

    if (action === 'confirm') {
      session.status = 'confirmed'
      session.user = { id: userId, email: userEmail, name: userName }
      session.token = `qr-token-${sessionId.slice(0, 16)}`
      return NextResponse.json({ success: true })
    }

    if (action === 'deny') {
      session.status = 'denied'
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'Ação inválida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('QR confirm error:', error)
    return NextResponse.json(
      { success: false, error: 'Falha ao confirmar QR' },
      { status: 500 }
    )
  }
}
