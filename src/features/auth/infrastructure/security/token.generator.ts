/**
 * Cryptographically secure token generation for email verification
 * Replaces UUID v4 with proper crypto.randomBytes
 * Tokens are hashed before storage for additional security
 */

import crypto from 'crypto';

/**
 * Token generation configuration
 */
const TOKEN_CONFIG = {
  BYTE_LENGTH: 32, // 256 bits = 64 hex chars
  EXPIRY_MINUTES: 15, // Email verification token valid for 15 minutes
  ENCODING: 'hex' as const,
} as const;

/**
 * Verification token data returned to caller
 */
export interface GeneratedToken {
  token: string; // Raw token to send to user (one-time use)
  hashedToken: string; // Token hash for database storage
  expiresAt: Date; // Expiration timestamp
}

/**
 * Generates a cryptographically secure verification token
 *
 * @returns Generated token with hash for safe storage
 *
 * @example
 * const { token, hashedToken, expiresAt } = generateVerificationToken();
 * // token → sent to user via email/SMS
 * // hashedToken → stored in database
 * // expiresAt → token expiration time
 */
export function generateVerificationToken(): GeneratedToken {
  // Generate cryptographically secure random bytes
  const randomBytes = crypto.randomBytes(TOKEN_CONFIG.BYTE_LENGTH);

  // Convert to hex string (64 characters)
  const token = randomBytes.toString(TOKEN_CONFIG.ENCODING);

  // Hash token for database storage (one-way)
  // This prevents token theft if database is compromised
  const hashedToken = crypto.createHash('sha256').update(token).digest(TOKEN_CONFIG.ENCODING);

  // Calculate expiration time (15 minutes from now)
  const expiresAt = new Date(Date.now() + TOKEN_CONFIG.EXPIRY_MINUTES * 60 * 1000);

  return {
    token, // Raw (send to user)
    hashedToken, // Hashed (store in DB)
    expiresAt,
  };
}

/**
 * Hash a token for comparison with database value
 * Used when verifying token from user
 *
 * @param token - Raw token from user
 * @returns Hashed token for database comparison
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Check if token has expired
 *
 * @param expiresAt - Token expiration timestamp
 * @returns true if expired, false if still valid
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Get token expiration time in seconds (useful for cache headers)
 *
 * @param expiresAt - Token expiration timestamp
 * @returns Seconds until expiration, 0 if already expired
 */
export function getTokenTTL(expiresAt: Date): number {
  const secondsUntilExpiry = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
  return Math.max(0, secondsUntilExpiry);
}

/**
 * Configuration for token cleanup (cron job)
 */
export const TOKEN_CLEANUP_CONFIG = {
  RUN_INTERVAL_HOURS: 24, // Run cleanup daily
  BATCH_SIZE: 1000, // Delete in batches for large datasets
} as const;
