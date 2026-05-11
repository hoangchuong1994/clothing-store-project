'use server';

import type { RegistrationInput } from '../../domain/validation/registration.validator';
import AuthService from '../../application/auth.service';
import {
  AuthError,
  getSafeErrorMessage,
  isAuthError,
} from '../../domain/exceptions/auth.exceptions';
import { DuplicateEmailError } from '../../domain/exceptions/auth.exceptions';
import { AuthLogger } from '../../infrastructure/logging/structured-logger';
import { getClientIp } from '@/lib/server/utils/get-client-ip';
import { checkRegisterRateLimit } from '../../infrastructure/security/rate-limiter';

interface RegisterActionResult {
  success: boolean;
  message?: string;
  code?: string;
  redirectUrl?: string;
}

export async function registerAction(
  values: RegistrationInput,
  request?: Request,
): Promise<RegisterActionResult> {
  const { email } = values;
  const ip = getClientIp(request);

  try {
    // Check rate limit
    try {
      await checkRegisterRateLimit(ip);
    } catch (error) {
      if (isAuthError(error)) {
        AuthLogger.warn('registration_rate_limited', {
          email,
          ip,
        });
        return {
          success: false,
          message: 'Too many registration attempts. Please try again later.',
          code: 'RATE_LIMITED',
        };
      }
      throw error;
    }

    // Register user
    const result = await AuthService.registerUser(values);

    AuthLogger.info('user_registered_successfully', {
      userId: result.userId,
      email: result.email,
      ip,
    });

    return {
      success: true,
      message: 'Registration successful. Please verify your email.',
      redirectUrl: '/verify-email',
    };
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      AuthLogger.warn('registration_duplicate_email', {
        email,
        ip,
      });
      return {
        success: false,
        message: 'Email already registered',
        code: 'EMAIL_ALREADY_EXISTS',
      };
    }

    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
        code: error.code,
      };
    }

    AuthLogger.error('registration_error', error as Error, { email, ip });
    return {
      success: false,
      message: getSafeErrorMessage(error),
      code: 'UNKNOWN_ERROR',
    };
  }
}
