'use server';

import prisma from '@/lib/server/prisma/prisma';
import { hashPassword } from '../infrastructure/security/hash';
import { generateVerificationToken } from '../infrastructure/security/token.generator';
import { AuthLogger } from '../infrastructure/logging/structured-logger';
import { AuthError, getSafeErrorMessage } from '../domain/errors';
import { ResetPasswordSchema } from '../domain/validation/auth-schemas';
import type { ResetPasswordInput } from '../domain/validation/auth-schemas';

interface ResetPasswordActionResult {
  success: boolean;
  message?: string;
  code?: string;
}

/**
 * Reset password with token
 */
export async function resetPasswordAction(
  token: string,
  password: string,
): Promise<ResetPasswordActionResult> {
  try {
    const validation = ResetPasswordSchema.safeParse({ token, password });
    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid password or token',
        code: 'INVALID_FIELDS',
      };
    }

    const input = validation.data as ResetPasswordInput;

    // Find reset token
    const resetToken = await prisma.verificationToken.findFirst({
      where: {
        token: input.token,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!resetToken) {
      return {
        success: false,
        message: 'Invalid or expired password reset link',
        code: 'TOKEN_EXPIRED',
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid or expired password reset link',
        code: 'USER_NOT_FOUND',
      };
    }

    const hashedPassword = await hashPassword(input.password);

    // Update password and delete reset token atomically
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.verificationToken.deleteMany({
        where: {
          email: resetToken.email,
        },
      }),
    ]);

    AuthLogger.info('password_reset_completed', {
      userId: user.id,
      email: user.email,
    });

    return {
      success: true,
      message: 'Password reset successfully',
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
        code: error.code,
      };
    }

    AuthLogger.error('password_reset_error', error as Error);
    return {
      success: false,
      message: getSafeErrorMessage(error),
      code: 'UNKNOWN_ERROR',
    };
  }
}
