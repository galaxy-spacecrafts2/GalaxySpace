import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    // Usar better-auth para fazer logout
    await auth.api.signOut({
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
