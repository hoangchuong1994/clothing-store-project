import type { AuthErrorCode } from '../../domain/exceptions/auth-error.codes';

export const AUTH_ERROR_TRANSLATION_KEYS: Record<AuthErrorCode, string> = {
  INVALID_CREDENTIALS: 'auth.error.invalidCredentials',
  EMAIL_NOT_FOUND: 'auth.error.emailNotFound',
  EMAIL_ALREADY_EXISTS: 'auth.error.emailAlreadyExists',
  EMAIL_NOT_VERIFIED: 'auth.error.emailNotVerified',
  ACCOUNT_NOT_LINKED: 'auth.error.accountNotLinked',
  OAUTH_ERROR: 'auth.error.oauthError',
  INVALID_FIELDS: 'auth.error.invalidFields',
  RATE_LIMITED: 'auth.error.rateLimited',
  VERIFICATION_FAILED: 'auth.error.verificationFailed',
  GENERIC_FAILURE: 'auth.error.unknownError',
  TOKEN_NOT_FOUND: 'auth.error.tokenNotFound',
  TOKEN_EXPIRED: 'auth.error.tokenExpired',
  TOKEN_ALREADY_USED: 'auth.error.tokenAlreadyUsed',
  EMAIL_SEND_ERROR: 'auth.error.emailSendError',
  DATABASE_ERROR: 'auth.error.databaseError',
  UNKNOWN_ERROR: 'auth.error.unknownError',
};

export function mapAuthErrorToTranslationKey(code: AuthErrorCode): string {
  return AUTH_ERROR_TRANSLATION_KEYS[code] ?? 'auth.error.unknownError';
}
