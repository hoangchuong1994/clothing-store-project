import type { z } from 'zod';
import { type LoginSchema, type RegisterSchema } from './validation/auth-schemas';

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'error.invalidCredentials',
  EMAIL_NOT_FOUND: 'error.emailNotFound',
  EMAIL_ALREADY_EXISTS: 'error.emailAlreadyExists',
  EMAIL_NOT_VERIFIED: 'error.emailNotVerified',
  ACCOUNT_NOT_LINKED: 'error.accountNotLinked',
  OAUTH_ERROR: 'error.oauthError',
  INVALID_FIELDS: 'error.invalidFields',
  RATE_LIMITED: 'error.rateLimited',
  VERIFICATION_FAILED: 'error.verificationFailed',
  GENERIC_FAILURE: 'error.unknownError',
  TOKEN_NOT_FOUND: 'error.tokenNotFound',
  TOKEN_EXPIRED: 'error.tokenExpired',
  TOKEN_ALREADY_USED: 'error.tokenAlreadyUsed',
  EMAIL_SEND_ERROR: 'error.emailSendError',
  DATABASE_ERROR: 'error.databaseError',
  UNKNOWN_ERROR: 'error.unknownError',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

export interface AuthErrorPayload {
  code: AuthErrorCode;
  message: string;
  details?: Record<string, unknown>;
  isTranslated?: boolean;
}

export type AuthError = AuthErrorPayload;

export interface AuthResponse<T = void> {
  success: boolean;
  data?: T;
  error?: AuthErrorPayload;
}

export type SocialProvider = 'google' | 'github';

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;

export interface OAuthAccountLinkingError {
  provider: SocialProvider;
  email: string;
  linkedProvider?: SocialProvider;
}

export interface AuthUrlParams {
  callbackUrl?: string;
  error?: string;
  errorDetails?: OAuthAccountLinkingError;
}

export type RoleCode = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'SELLER' | 'CUSTOMER';
export type Scope = 'admin' | 'staff' | 'seller' | 'account' | 'cart';
