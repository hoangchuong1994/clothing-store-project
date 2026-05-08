'use server';

import bcrypt from 'bcryptjs';
import type { AuthResponse } from '../types/auth.types';
import { generateVerificationToken } from '../tokens/verification-token.generator';
import { RegistrationValidator } from '../validators/registration.validator';
import { UserRepository } from '../repositories/user.repository';
import { AuthLogger } from '../lib/structured-logger';
import {
  buildSuccessfulRegistrationResponse,
  buildGenericErrorResponse,
  buildValidationErrorResponse,
  buildErrorResponseFromAuthError,
  buildRegistrationAuditEntry,
  buildRateLimitErrorResponse,
} from '../lib/response-builders';
import {
  isAuthError,
  DuplicateEmailError,
  ValidationError,
  RateLimitError,
} from '../errors/auth.errors';
import { getClientIp } from '@/lib/server/utils/get-client-ip';
import { logRegistrationAttempt } from '../lib/audit-logger';
import { enqueueVerificationEmail } from '../mail/email.queue';
import { checkRegisterRateLimit } from '../lib/rate-limiter';

/**
 * Production-grade user registration with email verification
 *
 * Phase 2 Additions:
 * ✅ Rate limiting (5 registrations per hour per IP)
 * ✅ Generic responses for all paths
 * ✅ Structured audit logging
 *
 * Full Security Features:
 * ✅ Atomic transaction (user + token created together)
 * ✅ Crypto-secure token generation
 * ✅ Token hashing before storage
 * ✅ No auto sign-in (requires email verification)
 * ✅ Generic anti-enumeration responses
 * ✅ Structured error handling
 * ✅ Comprehensive validation
 * ✅ Rate limiting
 */
export async function registerUser(
  credentials: unknown,
  request?: Request,
): Promise<AuthResponse<{ redirectUrl: string; message: string }>> {
  const startTime = Date.now();
  const ip = getClientIp(request);
  const userAgent = request?.headers.get('user-agent') || undefined;

  const auditData = {
    email: '',
    name: '',
    ip,
    userAgent,
    success: false,
    error: undefined as string | undefined,
  };
  console.log('[registerUser] Starting registration process', { ip, userAgent });

  AuthLogger.info('registration_started', {
    ip,
    userAgent,
  });

  try {
    // 1. RATE LIMIT CHECK (Phase 2)
    try {
      await checkRegisterRateLimit(ip);
    } catch (error) {
      if (error instanceof RateLimitError) {
        auditData.error = 'RATE_LIMITED';
        await logRegistrationAttempt(buildRegistrationAuditEntry(auditData));
        return buildRateLimitErrorResponse(error.context?.retryAfter as number);
      }
      throw error;
    }

    // 2. VALIDATE INPUT (strict backend validation)
    const validatedInput = await RegistrationValidator.validate(credentials);
    auditData.email = validatedInput.email;
    auditData.name = validatedInput.name;

    console.log('[registerUser] Validated input:', validatedInput);

    // 3. HASH PASSWORD (before storing)
    const hashedPassword = await bcrypt.hash(validatedInput.password, 12);

    // 4. GENERATE SECURE TOKEN
    const { token: rawToken, hashedToken, expiresAt } = generateVerificationToken();

    // 5. CREATE USER + TOKEN ATOMICALLY
    const { user, verificationToken } = await UserRepository.createWithVerificationToken(
      {
        email: validatedInput.email,
        password: hashedPassword,
        name: validatedInput.name,
      },
      {
        rawToken,
        hashedToken,
        expiresAt,
      },
    );

    // 6. QUEUE VERIFICATION EMAIL (async, non-blocking)
    enqueueVerificationEmail({
      userId: user.id,
      email: validatedInput.email,
      name: user.name || undefined,
      token: rawToken,
      expiresAt: verificationToken.expiresAt,
    }).catch((error) => {
      console.error('[Auth] Failed to queue verification email:', {
        userId: user.id,
        email: validatedInput.email,
        error: error instanceof Error ? error.message : String(error),
      });
    });

    // 7. LOG SUCCESSFUL REGISTRATION
    auditData.success = true;
    await logRegistrationAttempt(buildRegistrationAuditEntry(auditData));
    AuthLogger.info('registration_success', {
      userId: user.id,
      email: user.email,
      ip,
    });

    // 8. RETURN SUCCESS (same for new user or existing - anti-enumeration)
    return buildSuccessfulRegistrationResponse();
  } catch (error) {
    // Handle specific errors
    if (error instanceof ValidationError) {
      auditData.error = 'VALIDATION_FAILED';
      await logRegistrationAttempt(buildRegistrationAuditEntry(auditData));

      const result = buildValidationErrorResponse(error.errors);
      console.warn('result', result);
      return result;
    }

    if (error instanceof RateLimitError) {
      auditData.error = 'RATE_LIMITED';
      await logRegistrationAttempt(buildRegistrationAuditEntry(auditData));
      return buildRateLimitErrorResponse(error.context?.retryAfter as number);
    }

    if (error instanceof DuplicateEmailError) {
      // ANTI-ENUMERATION: Return same success message
      auditData.error = 'DUPLICATE_EMAIL';
      await logRegistrationAttempt(buildRegistrationAuditEntry(auditData));
      return buildSuccessfulRegistrationResponse();
    }

    if (isAuthError(error)) {
      auditData.error = error.code;
      await logRegistrationAttempt(buildRegistrationAuditEntry(auditData));

      return buildErrorResponseFromAuthError(error);
    }

    // Unknown error
    auditData.error = 'UNKNOWN_ERROR';
    AuthLogger.error('registration_failed', error as Error, {
      duration: Date.now() - startTime,
      ip,
    });

    await logRegistrationAttempt(buildRegistrationAuditEntry(auditData));
    return buildGenericErrorResponse(error as Error);
  }
}
