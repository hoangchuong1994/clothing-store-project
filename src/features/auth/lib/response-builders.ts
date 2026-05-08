/**
 * Reusable auth response builders
 * Ensures consistent, secure API responses
 */

import type { AuthError } from '../errors/auth.errors';
import type { AuthResponse } from '../types/auth.types';
import { getSafeErrorMessage } from '../errors/auth.errors';

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
 * Build successful registration response
 * Anti-enumeration: Same response for all paths to avoid leaking user existence
 */
export function buildSuccessfulRegistrationResponse(): AuthResponse<{
  message: string;
  redirectUrl: string;
}> {
  return {
    success: true,
    data: {
      message: 'Check your email to verify your account',
      redirectUrl: '/auth/check-email',
    },
  };
}

/**
 * Build generic error response
 * Anti-enumeration: Hide whether email exists or other error types
 */
export function buildGenericErrorResponse(error?: AuthError | Error): AuthResponse<never> {
  return {
    success: false,
    error: {
      code: 'REGISTRATION_FAILED',
      message: 'registration.error.generic',
      details:
        process.env.NODE_ENV === 'development' && error
          ? { originalError: error instanceof Error ? error.message : String(error) }
          : undefined,
    },
  };
}

/**
 * Build rate limit error response
 * Informs user about rate limiting
 */
export function buildRateLimitErrorResponse(retryAfter?: number): AuthResponse<never> {
  return {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'auth.error.rateLimited',
      details: retryAfter ? { retryAfter } : undefined,
    },
  };
}

/**
 * Build validation error response
 * Returns field-level errors for UX
 */
export function buildValidationErrorResponse(
  errors: Array<{ field: string; message: string }>,
): AuthResponse<never> {
  return {
    success: false,
    error: {
      code: 'INVALID_FIELDS',
      message: 'auth.error.invalidFields',
      details: {
        errors: errors.map((e) => ({
          field: e.field,
          message: e.message,
        })),
      },
    },
  };
}

/**
 * Build successful email verification response
 */
export function buildSuccessfulVerificationResponse(): AuthResponse<{
  message: string;
  redirectUrl: string;
}> {
  return {
    success: true,
    data: {
      message: 'Email verified successfully',
      redirectUrl: '/auth/signin',
    },
  };
}

/**
 * Build generic verification error response
 * Anti-enumeration: Don't reveal whether token is invalid or expired
 */
export function buildVerificationErrorResponse(): AuthResponse<never> {
  return {
    success: false,
    error: {
      code: 'VERIFICATION_FAILED',
      message: 'auth.error.verificationFailed',
    },
  };
}

/**
 * Build resend verification response
 * Always returns success to avoid enumeration
 */
export function buildResendVerificationResponse(): AuthResponse<{
  message: string;
}> {
  return {
    success: true,
    data: {
      message: 'Check your email for verification link',
    },
  };
}

/**
 * Convert auth error to response
 * Uses error classification for appropriate response
 */
export function buildErrorResponseFromAuthError(error: AuthError): AuthResponse<never> {
  // For security-critical operations, return generic message
  if (error.code === 'EMAIL_ALREADY_EXISTS' || error.code === 'INVALID_FIELDS') {
    return buildGenericErrorResponse(error);
  }

  if (error.code === 'RATE_LIMITED') {
    const retryAfter = (error.context?.retryAfter as number) || undefined;
    return buildRateLimitErrorResponse(retryAfter);
  }

  if (
    error.code === 'TOKEN_EXPIRED' ||
    error.code === 'TOKEN_ALREADY_USED' ||
    error.code === 'TOKEN_NOT_FOUND'
  ) {
    return buildVerificationErrorResponse();
  }

  // Default: generic error
  return buildGenericErrorResponse(error);
}

/**
 * Sanitize email for logging (prevent full exposure)
 */
export function sanitizeEmailForLogging(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@***';
  return `${local.substring(0, 2)}***@${domain}`;
}

/**
 * Build audit log entry for registration attempt
 */
export function buildRegistrationAuditEntry(data: {
  email: string;
  name: string;
  ip: string;
  userAgent?: string;
  success: boolean;
  error?: string;
}): {
  userId?: string;
  action: string;
  actionType: 'CREATE';
  ip: string;
  userAgent?: string;
  metadata: LogMetadata;
} {
  return {
    action: 'registration_attempt',
    actionType: 'CREATE',
    ip: data.ip,
    userAgent: data.userAgent,
    metadata: {
      email: sanitizeEmailForLogging(data.email),
      name: data.name.substring(0, 20), // Limit length
      success: data.success,
      error: data.error,
      timestamp: new Date().toISOString(),
    },
  };
}
