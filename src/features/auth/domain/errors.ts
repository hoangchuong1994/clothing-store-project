import { AUTH_ERROR_CODES } from './types';

export class AuthError extends Error {
  constructor(
    public code: keyof typeof AUTH_ERROR_CODES,
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

export class DuplicateEmailError extends AuthError {
  constructor(email: string) {
    super('EMAIL_ALREADY_EXISTS', 409, false, 'Email already registered', { email });
    this.name = 'DuplicateEmailError';
    Object.setPrototypeOf(this, DuplicateEmailError.prototype);
  }
}

export class TokenNotFoundError extends AuthError {
  constructor() {
    super('TOKEN_NOT_FOUND', 404, false, 'Verification token not found');
    this.name = 'TokenNotFoundError';
    Object.setPrototypeOf(this, TokenNotFoundError.prototype);
  }
}

export class TokenExpiredError extends AuthError {
  constructor() {
    super('TOKEN_EXPIRED', 410, true, 'Verification token has expired');
    this.name = 'TokenExpiredError';
    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }
}

export class TokenAlreadyUsedError extends AuthError {
  constructor() {
    super('TOKEN_ALREADY_USED', 410, false, 'Verification token has already been used');
    this.name = 'TokenAlreadyUsedError';
    Object.setPrototypeOf(this, TokenAlreadyUsedError.prototype);
  }
}

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

export class DatabaseError extends AuthError {
  constructor(message?: string) {
    super('DATABASE_ERROR', 500, true, message || 'Database operation failed');
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class UnknownError extends AuthError {
  constructor(message?: string) {
    super('UNKNOWN_ERROR', 500, false, message || 'An unexpected error occurred');
    this.name = 'UnknownError';
    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

export function createErrorPayload(error: AuthError) {
  return {
    code: AUTH_ERROR_CODES[error.code as keyof typeof AUTH_ERROR_CODES] ?? 'error.unknownError',
    message: error.code,
    details: error.context,
    isTranslated: false,
  } as const;
}

export function getSafeErrorMessage(error: unknown): string {
  if (isAuthError(error)) {
    return AUTH_ERROR_CODES[error.code as keyof typeof AUTH_ERROR_CODES] ?? 'error.unknownError';
  }

  if (error instanceof Error) {
    return process.env.NODE_ENV === 'development' ? error.message : 'error.unknownError';
  }

  return 'error.unknownError';
}

export function isRetryableError(error: unknown): boolean {
  if (isAuthError(error)) {
    return error.retryable;
  }
  return false;
}
