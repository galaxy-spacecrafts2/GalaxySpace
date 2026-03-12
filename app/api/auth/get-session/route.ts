import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
  try {
    // Usar o better-auth para validar a sessão
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'No valid session found' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        authenticated: true,
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        createdAt: session.session.createdAt,
        expiresAt: session.session.expiresAt,
      }
    });

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
