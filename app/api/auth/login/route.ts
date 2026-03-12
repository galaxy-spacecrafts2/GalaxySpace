import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Usar better-auth para autenticar
    const session = await auth.api.signIn.email({
      body: {
        email,
        password,
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        user: session.user,
        token: session.token,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
