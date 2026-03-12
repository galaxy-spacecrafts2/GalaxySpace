import { NextRequest } from 'next/server'

export interface SecurityLogEntry {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL'
  category: 'AUTH' | 'SECURITY' | 'RATE_LIMIT' | 'VALIDATION' | 'SYSTEM'
  message: string
  details: {
    ip?: string
    userAgent?: string
    userId?: string
    endpoint?: string
    method?: string
    threats?: string[]
    error?: string
    stack?: string
    [key: string]: any
  }
}

class SecurityLogger {
  private logs: SecurityLogEntry[] = []
  private maxLogs = 1000 // Limitar logs em memória
  
  private createEntry(
    level: SecurityLogEntry['level'],
    category: SecurityLogEntry['category'],
    message: string,
    details: SecurityLogEntry['details']
  ): SecurityLogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details
    }
  }
  
  private log(entry: SecurityLogEntry) {
    // Adicionar ao array de logs
    this.logs.push(entry)
    
    // Manter apenas os logs mais recentes
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
    
    // Log para console com formatação especial
    const logMessage = `[${entry.timestamp}] ${entry.level} [${entry.category}] ${entry.message}`
    
    switch (entry.level) {
      case 'INFO':
        console.log(`✅ ${logMessage}`, entry.details)
        break
      case 'WARN':
        console.warn(`⚠️ ${logMessage}`, entry.details)
        break
      case 'ERROR':
        console.error(`❌ ${logMessage}`, entry.details)
        break
      case 'CRITICAL':
        console.error(`🚨 ${logMessage}`, entry.details)
        break
    }
    
    // Em produção, enviar para serviço de logging externo
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(entry)
    }
  }
  
  private async sendToExternalService(entry: SecurityLogEntry) {
    // Implementar envio para serviço como Datadog, Sentry, etc.
    try {
      // Exemplo: await fetch('https://logging-service.com/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // })
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }
  
  // Métodos específicos de logging
  info(category: SecurityLogEntry['category'], message: string, details: SecurityLogEntry['details'] = {}) {
    this.log(this.createEntry('INFO', category, message, details))
  }
  
  warn(category: SecurityLogEntry['category'], message: string, details: SecurityLogEntry['details'] = {}) {
    this.log(this.createEntry('WARN', category, message, details))
  }
  
  error(category: SecurityLogEntry['category'], message: string, details: SecurityLogEntry['details'] = {}) {
    this.log(this.createEntry('ERROR', category, message, details))
  }
  
  critical(category: SecurityLogEntry['category'], message: string, details: SecurityLogEntry['details'] = {}) {
    this.log(this.createEntry('CRITICAL', category, message, details))
  }
  
  // Métodos específicos para eventos de segurança
  logAuthAttempt(request: NextRequest, success: boolean, email?: string) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    this.log(this.createEntry(
      success ? 'INFO' : 'WARN',
      'AUTH',
      success ? `Successful authentication for ${email}` : `Failed authentication attempt for ${email}`,
      {
        ip,
        userAgent,
        email,
        endpoint: request.url,
        method: request.method,
        success
      }
    ))
  }
  
  logSecurityThreat(request: NextRequest, threats: string[], type: string) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    this.critical('SECURITY', `Security threat detected: ${type}`, {
      ip,
      userAgent,
      endpoint: request.url,
      method: request.method,
      threats,
      threatType: type,
      timestamp: new Date().toISOString()
    })
  }
  
  logRateLimit(request: NextRequest, limitType: string) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    this.warn('RATE_LIMIT', `Rate limit exceeded: ${limitType}`, {
      ip,
      userAgent,
      endpoint: request.url,
      method: request.method,
      limitType
    })
  }
  
  logValidationError(request: NextRequest, errors: string[]) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    this.warn('VALIDATION', `Input validation failed`, {
      ip,
      userAgent,
      endpoint: request.url,
      method: request.method,
      errors
    })
  }
  
  logSystemError(error: Error, context?: any) {
    this.error('SYSTEM', 'System error occurred', {
      error: error.message,
      stack: error.stack,
      context
    })
  }
  
  // Métodos para análise e relatórios
  getLogs(filters?: {
    level?: SecurityLogEntry['level']
    category?: SecurityLogEntry['category']
    ip?: string
    startTime?: Date
    endTime?: Date
  }): SecurityLogEntry[] {
    let filteredLogs = [...this.logs]
    
    if (filters) {
      if (filters.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filters.level)
      }
      if (filters.category) {
        filteredLogs = filteredLogs.filter(log => log.category === filters.category)
      }
      if (filters.ip) {
        filteredLogs = filteredLogs.filter(log => log.details.ip === filters.ip)
      }
      if (filters.startTime) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= filters.startTime!)
      }
      if (filters.endTime) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= filters.endTime!)
      }
    }
    
    return filteredLogs
  }
  
  getSecurityStats() {
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const recentLogs = this.getLogs({
      startTime: last24Hours,
      endTime: now
    })
    
    const stats = {
      totalLogs: recentLogs.length,
      criticalLogs: recentLogs.filter(log => log.level === 'CRITICAL').length,
      errorLogs: recentLogs.filter(log => log.level === 'ERROR').length,
      warnLogs: recentLogs.filter(log => log.level === 'WARN').length,
      authAttempts: recentLogs.filter(log => log.category === 'AUTH').length,
      securityThreats: recentLogs.filter(log => log.category === 'SECURITY').length,
      rateLimitHits: recentLogs.filter(log => log.category === 'RATE_LIMIT').length,
      validationErrors: recentLogs.filter(log => log.category === 'VALIDATION').length,
      uniqueIPs: [...new Set(recentLogs.map(log => log.details.ip).filter(Boolean))].length
    }
    
    return stats
  }
  
  // Detectar padrões suspeitos
  detectSuspiciousPatterns() {
    const now = new Date()
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000)
    
    const recentLogs = this.getLogs({
      startTime: lastHour,
      endTime: now
    })
    
    const patterns = []
    
    // Múltiplas falhas de autenticação do mesmo IP
    const ipAuthFailures = recentLogs
      .filter(log => log.category === 'AUTH' && log.message.includes('Failed'))
      .reduce((acc, log) => {
        const ip = log.details.ip
        acc[ip] = (acc[ip] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    
    Object.entries(ipAuthFailures).forEach(([ip, count]) => {
      if (count >= 5) {
        patterns.push(`Multiple auth failures from IP: ${ip} (${count} attempts)`)
      }
    })
    
    // Múltiplas ameaças de segurança do mesmo IP
    const ipThreats = recentLogs
      .filter(log => log.category === 'SECURITY')
      .reduce((acc, log) => {
        const ip = log.details.ip
        acc[ip] = (acc[ip] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    
    Object.entries(ipThreats).forEach(([ip, count]) => {
      if (count >= 3) {
        patterns.push(`Multiple security threats from IP: ${ip} (${count} threats)`)
      }
    })
    
    // Alta frequência de rate limiting
    const rateLimitCount = recentLogs.filter(log => log.category === 'RATE_LIMIT').length
    if (rateLimitCount >= 10) {
      patterns.push(`High rate limit activity: ${rateLimitCount} hits in last hour`)
    }
    
    return patterns
  }
  
  // Exportar logs para análise
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2)
    } else {
      // CSV format
      const headers = ['timestamp', 'level', 'category', 'message', 'ip', 'userAgent', 'threats']
      const rows = this.logs.map(log => [
        log.timestamp,
        log.level,
        log.category,
        log.message,
        log.details.ip || '',
        log.details.userAgent || '',
        (log.details.threats || []).join(';')
      ])
      
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
  }
  
  // Limpar logs antigos
  clearOldLogs(olderThanHours: number = 24) {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000)
    this.logs = this.logs.filter(log => new Date(log.timestamp) >= cutoff)
  }
}

// Instância global do logger
export const securityLogger = new SecurityLogger()

// Funções de conveniência para uso em outras partes do código
export const logAuthAttempt = (request: NextRequest, success: boolean, email?: string) => {
  securityLogger.logAuthAttempt(request, success, email)
}

export const logSecurityThreat = (request: NextRequest, threats: string[], type: string) => {
  securityLogger.logSecurityThreat(request, threats, type)
}

export const logRateLimit = (request: NextRequest, limitType: string) => {
  securityLogger.logRateLimit(request, limitType)
}

export const logValidationError = (request: NextRequest, errors: string[]) => {
  securityLogger.logValidationError(request, errors)
}

export const logSystemError = (error: Error, context?: any) => {
  securityLogger.logSystemError(error, context)
}
