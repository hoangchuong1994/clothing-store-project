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
  loginClientSchema,
  type LoginClientSchema,
} from '../../shared/validation/login-client.schema';
import { loginAction } from '../../presentation/actions/login.action';

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
  register: UseFormRegister<LoginClientSchema>;
  handleSubmit: UseFormHandleSubmit<LoginClientSchema>;
  formState: {
    errors: FieldErrors<LoginClientSchema>;
    isValid: boolean;
    isDirty: boolean;
  };
  isLoading: boolean;
  error: LoginError | null;
  success: boolean;
  onSubmit: (values: LoginClientSchema) => Promise<void>;
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
  const form = useForm<LoginClientSchema>({
    resolver: zodResolver(loginClientSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
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
    async (values: LoginClientSchema) => {
      clearError();
      setSuccess(false);

      startTransition(async () => {
        try {
          const result = await loginAction({
            email: values.email,
            password: values.password,
            remember: values.remember,
          });
          console.log('Login result:', result);
          setSuccess(true);

          window.location.href = callbackUrl;
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
