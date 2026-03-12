export interface QRSession {
  sessionId: string
  qrData: string
  authUrl: string
  expiresAt: number
  expiresIn: number
  status: 'pending' | 'scanned' | 'confirmed' | 'denied'
  deviceInfo?: string
  token?: string
  user?: {
    id: string
    email: string
    name?: string
  }
}

declare global {
  var __qrSessions: Map<string, QRSession> | undefined
}

export const qrSessions: Map<string, QRSession> =
  global.__qrSessions ?? (global.__qrSessions = new Map())
