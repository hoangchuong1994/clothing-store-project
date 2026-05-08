'use server';

import { signIn } from '@/features/auth/server/auth-config';
import AuthService from './auth.service';
import { AuthError, getSafeErrorMessage } from '../domain/errors';
import type { LoginInput } from '../domain/validation/auth-schemas';
import { LoginSchema } from '../domain/validation/auth-schemas';

interface LoginActionResult {
  success: boolean;
  message?: string;
  code?: string;
}

export async function loginAction(email: string, password: string): Promise<LoginActionResult> {
  try {
    const validation = LoginSchema.safeParse({ email, password });

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid email or password format',
        code: 'INVALID_FIELDS',
      };
    }

    const validated = validation.data as LoginInput;
    const authenticated = await AuthService.validateCredentials(
      validated.email,
      validated.password,
    );

    if (!authenticated) {
      return {
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      };
    }

    const result = await signIn('credentials', {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        message: result.error,
        code: 'LOGIN_FAILED',
      };
    }

    return { success: true };
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
