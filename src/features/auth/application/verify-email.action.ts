'use server';

import AuthService from './auth.service';
import { AuthError, getSafeErrorMessage } from '../domain/errors';

interface VerifyEmailActionResult {
  success: boolean;
  message?: string;
  code?: string;
  userId?: string;
}

export async function verifyEmailAction(token: string): Promise<VerifyEmailActionResult> {
  try {
    const result = await AuthService.verifyEmail(token);

    return {
      success: true,
      userId: result.userId,
      message: 'Email verified successfully',
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
        code: error.code,
      };
    }

    return {
      success: false,
      message: getSafeErrorMessage(error),
      code: 'UNKNOWN_ERROR',
    };
  }
}
