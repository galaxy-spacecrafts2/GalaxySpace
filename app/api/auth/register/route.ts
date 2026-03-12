import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { validateFormData, secureRegisterSchema, checkUserRateLimit, detectSuspiciousActivity } from '@/lib/security/validator';

export async function POST(request: NextRequest) {
  try {
    // Obter IP e User-Agent para logging de segurança
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Rate limiting por IP
    if (!checkUserRateLimit(ip, 5, 15 * 60 * 1000)) { // 5 tentativas em 15 minutos
      console.warn(`🚨 Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Detectar atividade suspeita
    const suspiciousCheck = detectSuspiciousActivity({
      userAgent,
      ip,
      requestCount: 1,
      timeWindow: 60000
    });
    
    if (suspiciousCheck.isSuspicious) {
      console.warn(`🚨 Suspicious activity detected: ${suspiciousCheck.reasons.join(', ')} from IP: ${ip}`);
      return NextResponse.json(
        { error: 'Suspicious activity detected' },
        { status: 403 }
      );
    }
    
    // Validar e sanitizar dados com segurança máxima
    const body = await request.json();
    const validation = validateFormData(secureRegisterSchema, body);
    
    if (!validation.isValid) {
      console.warn(`🚨 Security validation failed: ${validation.threats.join(', ')} from IP: ${ip}`);
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.threats },
        { status: 400 }
      );
    }
    
    const { email, password, name } = validation.sanitizedData!;
    
    // Verificação adicional de segurança
    const suspiciousEmailPatterns = [
      /tempmail\.com/i, /10minutemail/i, /guerrillamail/i,
      /mailinator/i, /throwaway/i, /disposable/i
    ];
    
    if (suspiciousEmailPatterns.some(pattern => pattern.test(email))) {
      console.warn(`🚨 Disposable email detected: ${email} from IP: ${ip}`);
      return NextResponse.json(
        { error: 'Disposable email addresses are not allowed' },
        { status: 400 }
      );
    }
    
    // Usar better-auth para registrar
    const session = await auth.api.signUp.email({
      body: {
        email,
        password,
        name,
      },
    });

    if (!session) {
      console.warn(`🚨 Registration failed for email: ${email} from IP: ${ip}`);
      return NextResponse.json(
        { error: 'Registration failed' },
        { status: 400 }
      );
    }

    // Log de sucesso
    console.log(`✅ Successful registration for email: ${email} from IP: ${ip}`);

    return NextResponse.json({
      success: true,
      session: {
        user: session.user,
        token: session.token,
      }
    });

  } catch (error: any) {
    console.error('🚨 Registration error:', error);
    
    // Log detalhado para análise de segurança
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    console.error(`🚨 Error details - IP: ${ip}, Error: ${error.message}`);
    
    // Tratar erros específicos do better-auth
    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Em caso de erro desconhecido, retornar mensagem genérica
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
