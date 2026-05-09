'use client';

/**
 * useLogin hook
 * Encapsulates all login logic and state management
 * Keeps LoginForm component pure and focused on presentation
 */

import { useCallback, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useForm,
  type FieldErrors,
  type UseFormHandleSubmit,
  type UseFormRegister,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';

import {
  LoginSchema,
  type LoginSchema as LoginSchemaType,
} from '../../domain/validation/auth-schemas';
import { loginAction } from '../../application/login.action';

/**
 * Parse OAuth error from URL params
 */
function parseOAuthError(
  searchParams: URLSearchParams | ReturnType<typeof useSearchParams>,
): string | null {
  return searchParams.get('error');
}

interface LoginError {
  message: string;
  code?: string;
  field?: string;
}

interface UseLoginReturn {
  register: UseFormRegister<LoginSchemaType>;
  handleSubmit: UseFormHandleSubmit<LoginSchemaType>;
  formState: {
    errors: FieldErrors<LoginSchemaType>;
    isValid: boolean;
    isDirty: boolean;
  };
  isLoading: boolean;
  error: LoginError | null;
  success: boolean;
  onSubmit: (values: LoginSchemaType) => Promise<void>;
  onSocialAuth: (provider: 'google' | 'github') => Promise<void>;
  clearError: () => void;
  getErrorMessage: (authError: LoginError | null) => string;
}

/**
 * Custom hook for login functionality
 * Manages form state, auth logic, error handling, and translations
 *
 * @returns Login hook methods and state
 */
export function useLogin(): UseLoginReturn {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<LoginError | null>(null);
  const [success, setSuccess] = useState(false);

  // Get callback URL from params
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Check for OAuth errors in URL
  const initialOAuthError = parseOAuthError(searchParams);

  /**
   * Initialize form with validation
   */
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  });

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle form submission with credentials
   */
  const onSubmit = useCallback(
    async (values: LoginSchemaType) => {
      clearError();
      setSuccess(false);

      startTransition(async () => {
        try {
          const result = await loginAction(values.email, values.password);

          if (!result.success) {
            setError({
              message: result.message || 'Login failed',
              code: result.code,
            });
            return;
          }

          // Mark as successful before redirect
          setSuccess(true);

          // Redirect after short delay for UX feedback
          setTimeout(() => {
            window.location.href = callbackUrl;
          }, 500);
        } catch (err) {
          console.error('Login error:', err);
          setError({
            message: 'An unexpected error occurred',
            code: 'UNKNOWN_ERROR',
          });
        }
      });
    },
    [callbackUrl, clearError],
  );

  /**
   * Handle social provider authentication
   */
  const onSocialAuth = useCallback(
    async (provider: 'google' | 'github') => {
      clearError();
      setSuccess(false);

      try {
        await signIn(provider, {
          redirect: true,
          callbackUrl,
        });
      } catch (err) {
        console.error(`${provider} auth error:`, err);
        setError({
          message: `Failed to sign in with ${provider}`,
          code: 'OAUTH_ERROR',
        });
      }
    },
    [callbackUrl, clearError],
  );

  /**
   * Format error for display
   * Returns translation key or plain message
   */
  const getErrorMessage = useCallback((authError: LoginError | null): string => {
    if (!authError) return '';
    return authError.message;
  }, []);

  return {
    // Form methods
    register: form.register,
    handleSubmit: form.handleSubmit,
    formState: {
      errors: form.formState.errors,
      isValid: form.formState.isValid,
      isDirty: form.formState.isDirty,
    },

    // State
    isLoading: isPending,
    error,
    success,

    // Methods
    onSubmit,
    onSocialAuth,
    clearError,
    getErrorMessage,
  };
}
