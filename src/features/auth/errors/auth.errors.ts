/**
 * Production-grade auth error classes
 * Enables structured error handling with proper classification
 */

/**
 * Base auth error with structured metadata
 */
export class AuthError extends Error {
  constructor(
    public code: string,
    public statusCode: number = 400,
    public retryable: boolean = false,
    message?: string,
    public context?: Record<string, unknown>,
  ) {
    super(message || code);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * Duplicate email registration attempt
 */
export class DuplicateEmailError extends AuthError {
  constructor(email: string) {
    super('EMAIL_ALREADY_EXISTS', 409, false, 'Email already registered', { email });
    this.name = 'DuplicateEmailError';
    Object.setPrototypeOf(this, DuplicateEmailError.prototype);
  }
}

/**
 * Verification token not found
 */
export class TokenNotFoundError extends AuthError {
  constructor() {
    super('TOKEN_NOT_FOUND', 404, false, 'Verification token not found');
    this.name = 'TokenNotFoundError';
    Object.setPrototypeOf(this, TokenNotFoundError.prototype);
  }
}

/**
 * Verification token expired
 */
export class TokenExpiredError extends AuthError {
  constructor() {
    super('TOKEN_EXPIRED', 410, true, 'Verification token has expired');
    this.name = 'TokenExpiredError';
    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }
}

/**
 * Verification token already used
 */
export class TokenAlreadyUsedError extends AuthError {
  constructor() {
    super('TOKEN_ALREADY_USED', 410, false, 'Verification token has already been used');
    this.name = 'TokenAlreadyUsedError';
    Object.setPrototypeOf(this, TokenAlreadyUsedError.prototype);
  }
}

/**
 * Invalid input validation
 */
export class ValidationError extends AuthError {
  constructor(
    public errors: Array<{ field: string; message: string }>,
    message: string = 'Validation failed',
  ) {
    super('INVALID_FIELDS', 422, false, message, { errors });
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Rate limit exceeded
 */
export class RateLimitError extends AuthError {
  constructor(retryAfter?: number) {
    super(
      'RATE_LIMITED',
      429,
      true,
      'Too many requests. Please try again later.',
      retryAfter ? { retryAfter } : undefined,
    );
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Email sending failed
 */
export class EmailSendError extends AuthError {
  constructor(reason?: string) {
    super(
      'EMAIL_SEND_ERROR',
      500,
      true,
      'Failed to send verification email',
      reason ? { reason } : undefined,
    );
    this.name = 'EmailSendError';
    Object.setPrototypeOf(this, EmailSendError.prototype);
  }
}

/**
 * Database operation failed
 */
export class DatabaseError extends AuthError {
  constructor(message?: string) {
    super('DATABASE_ERROR', 500, true, message || 'Database operation failed');
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Unknown/unhandled error
 */
export class UnknownError extends AuthError {
  constructor(message?: string) {
    super('UNKNOWN_ERROR', 500, false, message || 'An unexpected error occurred');
    this.name = 'UnknownError';
    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}

/**
 * Type guard for auth errors
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

/**
 * Safe error message for API responses
 * Hides sensitive information in production
 */
export function getSafeErrorMessage(error: unknown): string {
  if (isAuthError(error)) {
    // Use error code as i18n key
    return error.code;
  }

  if (error instanceof Error) {
    // Generic message in production
    return process.env.NODE_ENV === 'development' ? error.message : 'UNKNOWN_ERROR';
  }

  return 'UNKNOWN_ERROR';
}

/**
 * Extract retryable errors for client-side handling
 */
export function isRetryableError(error: unknown): boolean {
  if (isAuthError(error)) {
    return error.retryable;
  }
  return false;
}
