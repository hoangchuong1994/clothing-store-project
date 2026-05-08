/**
 * Structured logging for authentication
 * Phase 2: Comprehensive audit logging and monitoring
 */

import type { ActivityType } from '@/generated/prisma/enums';

/**
 * Type for log metadata values
 */
type LogMetadataValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | unknown[];

/**
 * Type for log metadata
 */
type LogMetadata = Record<string, LogMetadataValue>;

/**
 * Log levels for structured logging
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

/**
 * Structured log entry
 */
export interface AuthLogEntry {
  level: LogLevel;
  action: string;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  statusCode?: number;
  duration?: number;
  metadata?: LogMetadata;
  error?: {
    code: string;
    message: string;
    stack?: string;
  };
  timestamp: string;
  environment: string;
  version: string;
}

/**
 * Auth logger with structured output
 */
export class AuthLogger {
  private static readonly VERSION = '1.0.0';

  /**
   * Create structured log entry
   */
  private static createLogEntry(
    level: LogLevel,
    action: string,
    data: {
      userId?: string;
      email?: string;
      ip?: string;
      userAgent?: string;
      statusCode?: number;
      duration?: number;
      metadata?: LogMetadata;
      error?: Error | { code: string; message: string };
    },
  ): AuthLogEntry {
    let errorData: AuthLogEntry['error'] = undefined;

    if (data.error) {
      if (data.error instanceof Error) {
        errorData = {
          code: 'UNKNOWN',
          message: data.error.message,
          stack: process.env.NODE_ENV === 'development' ? data.error.stack : undefined,
        };
      } else {
        errorData = {
          code: data.error.code || 'UNKNOWN',
          message: data.error.message || 'Unknown error',
        };
      }
    }

    return {
      level,
      action,
      userId: data.userId,
      email: data.email ? this.sanitizeEmail(data.email) : undefined,
      ip: data.ip ? this.anonymizeIp(data.ip) : undefined,
      userAgent: this.truncateUserAgent(data.userAgent),
      statusCode: data.statusCode,
      duration: data.duration,
      metadata: data.metadata,
      error: errorData,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: this.VERSION,
    };
  }

  /**
   * Sanitize email for logging
   */
  private static sanitizeEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) return '***@***';
    return `${local.substring(0, 2)}***@${domain}`;
  }

  /**
   * Anonymize IP address
   */
  private static anonymizeIp(ip: string): string {
    if (ip === 'unknown') return 'unknown';

    const parts = ip.split('.');
    if (parts.length === 4) {
      // IPv4: keep first 2 octets
      return `${parts[0]}.${parts[1]}.0.0`;
    }

    if (ip.includes(':')) {
      // IPv6: keep first 3 segments
      const segments = ip.split(':');
      return `${segments[0]}:${segments[1]}:${segments[2]}:****`;
    }

    return ip;
  }

  /**
   * Truncate user agent for logging
   */
  private static truncateUserAgent(ua?: string): string | undefined {
    if (!ua) return undefined;
    return ua.substring(0, 255);
  }

  /**
   * Log info level
   */
  static info(action: string, data?: LogMetadata): void {
    const entry = this.createLogEntry(LogLevel.INFO, action, data || {});
    console.log(JSON.stringify(entry));
  }

  /**
   * Log debug level
   */
  static debug(action: string, data?: LogMetadata): void {
    if (process.env.NODE_ENV === 'development') {
      const entry = this.createLogEntry(LogLevel.DEBUG, action, data || {});
      console.log(JSON.stringify(entry));
    }
  }

  /**
   * Log warning
   */
  static warn(action: string, data?: LogMetadata): void {
    const entry = this.createLogEntry(LogLevel.WARN, action, data || {});
    console.warn(JSON.stringify(entry));
  }

  /**
   * Log error
   */
  static error(action: string, error: Error | string, data?: LogMetadata): void {
    const entry = this.createLogEntry(LogLevel.ERROR, action, {
      ...data,
      error: error instanceof Error ? error : { code: 'UNKNOWN', message: error },
    });
    console.error(JSON.stringify(entry));
  }

  /**
   * Log critical error (requires immediate attention)
   */
  static critical(action: string, error: Error | string, data?: LogMetadata): void {
    const entry = this.createLogEntry(LogLevel.CRITICAL, action, {
      ...data,
      error: error instanceof Error ? error : { code: 'UNKNOWN', message: error },
    });
    console.error(JSON.stringify(entry));

    // In production, send alert to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendAlert(entry);
    }
  }

  /**
   * Send critical alert to monitoring service
   */
  private static sendAlert(entry: AuthLogEntry): void {
    // TODO: Integrate with monitoring service (Sentry, Datadog, etc.)
    console.error('[ALERT] Critical auth error:', entry);
  }

  /**
   * Log registration attempt with full details
   */
  static logRegistration(
    success: boolean,
    data: {
      email: string;
      name?: string;
      ip: string;
      userAgent?: string;
      duration: number;
      error?: Error;
    },
  ): void {
    this.info('registration_attempt', {
      email: data.email,
      success,
      duration: data.duration,
      ip: data.ip,
      userAgent: data.userAgent,
      error: data.error
        ? {
            code: 'REGISTRATION_FAILED',
            message: data.error.message,
          }
        : undefined,
    });
  }

  /**
   * Log email verification attempt
   */
  static logVerification(
    success: boolean,
    data: {
      email?: string;
      ip: string;
      error?: Error;
    },
  ): void {
    this.info('email_verification_attempt', {
      email: data.email,
      success,
      ip: data.ip,
      error: data.error
        ? {
            code: 'VERIFICATION_FAILED',
            message: data.error.message,
          }
        : undefined,
    });
  }

  /**
   * Log rate limit hit
   */
  static logRateLimit(
    action: string,
    data: {
      identifier: string; // IP or email
      limit: number;
      window: string;
    },
  ): void {
    this.warn('rate_limit_exceeded', {
      action,
      identifier: data.identifier,
      limit: data.limit,
      window: data.window,
    });
  }

  /**
   * Log suspicious activity
   */
  static logSuspiciousActivity(
    action: string,
    data: {
      ip: string;
      reason: string;
      details?: LogMetadata;
    },
  ): void {
    this.warn('suspicious_activity_detected', {
      action,
      ip: data.ip,
      reason: data.reason,
      details: data.details,
    });
  }
}

// Export convenience functions
export const logAuthInfo = (action: string, data?: LogMetadata) => AuthLogger.info(action, data);

export const logAuthError = (action: string, error: Error | string, data?: LogMetadata) =>
  AuthLogger.error(action, error, data);

export const logAuthDebug = (action: string, data?: LogMetadata) => AuthLogger.debug(action, data);
