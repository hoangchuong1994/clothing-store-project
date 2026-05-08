'use server';

import prisma from '@/lib/server/prisma/prisma';
import { generateVerificationToken } from '../infrastructure/security/token.generator';
import { enqueueVerificationEmail } from '../infrastructure/mail/email.queue';
import { AuthLogger } from '../infrastructure/logging/structured-logger';
import { AuthError, getSafeErrorMessage } from '../domain/errors';
import { emailSchema } from '../domain/validation/auth-schemas';

interface RequestPasswordResetResult {
  success: boolean;
  message?: string;
  code?: string;
}

/**
 * Request password reset for email
 * Returns generic response to prevent enumeration
 */
export async function requestPasswordResetAction(
  email: string,
): Promise<RequestPasswordResetResult> {
  try {
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      return {
        success: true,
        message: 'If email exists, password reset link has been sent',
      };
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Generic response to prevent enumeration
      AuthLogger.debug('password_reset_user_not_found', {
        email: normalizedEmail,
      });
      return {
        success: true,
        message: 'If email exists, password reset link has been sent',
      };
    }

    const { token: rawToken, hashedToken, expiresAt } = generateVerificationToken();

    // Store reset token
    await prisma.verificationToken.create({
      data: {
        email: normalizedEmail,
        token: hashedToken,
        expires: expiresAt,
      },
    });

    // Queue email
    await enqueueVerificationEmail({
      userId: user.id,
      email: normalizedEmail,
      token: rawToken,
      expiresAt,
    });

    AuthLogger.info('password_reset_requested', {
      userId: user.id,
      email: normalizedEmail,
    });

    return {
      success: true,
      message: 'If email exists, password reset link has been sent',
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
        code: error.code,
      };
    }

    AuthLogger.error('password_reset_request_error', error as Error, {
      email,
    });

    return {
      success: true,
      message: 'If email exists, password reset link has been sent',
    };
  }
}
