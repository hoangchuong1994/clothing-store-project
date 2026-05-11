import { AUTH_ERROR_CODES, type AuthErrorCode } from './auth-error.codes';

export interface AuthErrorContext {
  [key: string]: unknown;
}

export abstract class AuthDomainError extends Error {
  public readonly code: AuthErrorCode;
  public readonly statusCode: number;
  public readonly retryable: boolean;
  public readonly context?: AuthErrorContext;

  constructor(
    code: AuthErrorCode,
    statusCode: number,
    retryable: boolean,
    message: string,
    context?: AuthErrorContext,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.context = context;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public toPayload() {
    return {
      code: this.code,
      message: this.message,
      details: this.context,
    } as const;
  }
}

export class DuplicateEmailError extends AuthDomainError {
  constructor(email: string) {
    super(AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS, 409, false, 'Email already registered', { email });
  }
}

export class InvalidCredentialsError extends AuthDomainError {
  constructor() {
    super(
      AUTH_ERROR_CODES.INVALID_CREDENTIALS,
      401,
      false,
      'The provided credentials are invalid.',
    );
  }
}

export class EmailNotVerifiedError extends AuthDomainError {
  constructor() {
    super(AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED, 403, false, 'Email address has not been verified.');
  }
}

export class TokenNotFoundError extends AuthDomainError {
  constructor() {
    super(AUTH_ERROR_CODES.TOKEN_NOT_FOUND, 404, false, 'Verification token not found');
  }
}

export class TokenExpiredError extends AuthDomainError {
  constructor() {
    super(AUTH_ERROR_CODES.TOKEN_EXPIRED, 410, true, 'Verification token has expired');
  }
}

export class TokenAlreadyUsedError extends AuthDomainError {
  constructor() {
    super(
      AUTH_ERROR_CODES.TOKEN_ALREADY_USED,
      410,
      false,
      'Verification token has already been used',
    );
  }
}

export class ValidationError extends AuthDomainError {
  constructor(
    public readonly errors: Array<{ field: string; message: string }>,
    message = 'Validation failed',
  ) {
    super(AUTH_ERROR_CODES.INVALID_FIELDS, 422, false, message, { errors });
  }
}

export class RateLimitError extends AuthDomainError {
  constructor(retryAfter?: number) {
    super(
      AUTH_ERROR_CODES.RATE_LIMITED,
      429,
      true,
      'Too many requests. Please try again later.',
      retryAfter ? { retryAfter } : undefined,
    );
  }
}

export class EmailSendError extends AuthDomainError {
  constructor(reason?: string) {
    super(
      AUTH_ERROR_CODES.EMAIL_SEND_ERROR,
      500,
      true,
      'Failed to send email',
      reason ? { reason } : undefined,
    );
  }
}

export class DatabaseError extends AuthDomainError {
  constructor(message = 'Database operation failed') {
    super(AUTH_ERROR_CODES.DATABASE_ERROR, 500, true, message);
  }
}

export class UnknownError extends AuthDomainError {
  constructor(message = 'An unexpected error occurred') {
    super(AUTH_ERROR_CODES.UNKNOWN_ERROR, 500, false, message);
  }
}

export function isAuthDomainError(error: unknown): error is AuthDomainError {
  return error instanceof AuthDomainError;
}

// Compatibility aliases for migration
export const AuthError = AuthDomainError;
export type AuthError = AuthDomainError;
export const isAuthError = isAuthDomainError;

export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof AuthDomainError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
