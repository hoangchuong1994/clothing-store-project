/**
 * Email verification server action
 * Phase 2: Verify email with rate limiting and security
 */

'use server';

import type { AuthResponse } from '../types/auth.types';
import { generateVerificationToken } from '../tokens/verification-token.generator';
import { UserRepository } from '../repositories/user.repository';
import {
  buildResendVerificationResponse,
  buildSuccessfulVerificationResponse,
  buildVerificationErrorResponse,
  buildRateLimitErrorResponse,
} from '../lib/response-builders';
import { getClientIp } from '@/lib/server/utils/get-client-ip';
import { logRegistrationAttempt } from '../lib/audit-logger';
import { checkVerifyRateLimit, checkResendRateLimit } from '../lib/rate-limiter';
import { RateLimitError } from '../errors/auth.errors';
import { enqueueVerificationEmail } from '../mail/email.queue';
import { AuthLogger } from '../lib/structured-logger';

/**
 * Verify user email with token
 *
 * Security Features:
 * ✅ Rate limiting (10 attempts per hour per IP)
 * ✅ One-time use tokens
 * ✅ Token expiry check
 * ✅ Generic error messages (no enumeration)
 * ✅ Audit logging
 */
export async function verifyEmail(
  token: string,
  request?: Request,
): Promise<AuthResponse<{ redirectUrl: string; message: string }>> {
  const ip = getClientIp(request);

  try {
    // 1. RATE LIMIT CHECK
    try {
      await checkVerifyRateLimit(ip);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return buildRateLimitErrorResponse(error.context?.retryAfter as number);
      }
      throw error;
    }

    // 2. VALIDATE TOKEN INPUT
    if (!token || typeof token !== 'string' || token.length < 40 || token.length > 128) {
      return buildVerificationErrorResponse();
    }

    // 3. VERIFY EMAIL WITH TOKEN
    const result = await UserRepository.verifyEmailWithToken(token);

    // 4. LOG SUCCESSFUL VERIFICATION
    AuthLogger.info('email_verification_success', {
      userId: result.userId,
      email: result.email,
      ip,
    });

    await logRegistrationAttempt({
      userId: result.userId,
      action: 'email_verified',
      actionType: 'UPDATE',
      ip,
      metadata: {
        email: result.email,
        success: true,
      },
    });

    return buildSuccessfulVerificationResponse();
  } catch (error) {
    AuthLogger.error('email_verification_failed', error as Error, { ip });

    return buildVerificationErrorResponse();
  }
}

/**
 * Request email verification resend
 *
 * Security:
 * ✅ Rate limited (3 resends per hour per email)
 * ✅ Throttling between requests
 * ✅ Generic success response
 */
export async function resendVerificationEmail(
  email: string,
  request?: Request,
): Promise<AuthResponse<{ message: string }>> {
  const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';

  try {
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return buildResendVerificationResponse();
    }

    await checkResendRateLimit(normalizedEmail);

    const existingToken = await UserRepository.getVerificationTokenByEmail(normalizedEmail);

    if (existingToken) {
      const { token, hashedToken, expiresAt } = generateVerificationToken();
      const userId = (existingToken as { userId?: string | null }).userId;

      await UserRepository.createNewVerificationToken(normalizedEmail, {
        hashedToken,
        expiresAt,
        userId,
      });

      enqueueVerificationEmail({
        userId: userId || '',
        email: normalizedEmail,
        token,
        expiresAt,
      }).catch((err) => {
        AuthLogger.error('resend_verification_queue_failed', err as Error, {
          email: normalizedEmail,
        });
      });
    }

    AuthLogger.info('resend_verification_requested', {
      email: normalizedEmail,
      ip: getClientIp(request),
    });

    return buildResendVerificationResponse();
  } catch (error) {
    if (error instanceof RateLimitError) {
      AuthLogger.warn('resend_verification_rate_limited', {
        email: normalizedEmail,
      });
      return buildRateLimitErrorResponse(error.context?.retryAfter as number);
    }

    AuthLogger.error('resend_verification_failed', error as Error, {
      email: normalizedEmail,
    });
    return buildResendVerificationResponse();
  }
}
