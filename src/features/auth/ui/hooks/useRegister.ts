'use client';

/**
 * useRegister hook
 * Encapsulates all registration logic and state management
 * Keeps RegisterForm component pure and focused on presentation
 */

import { useCallback, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';

import {
  RegisterSchema,
  type RegisterSchema as RegisterSchemaType,
} from '../../domain/validation/auth-schemas';
import { registerAction } from '../../application/register.action';

interface RegisterError {
  message: string;
  code?: string;
  field?: string;
}

interface UseRegisterReturn {
  register: any;
  handleSubmit: any;
  control: any;
  formState: {
    errors: any;
    isValid: boolean;
    isDirty: boolean;
  };
  watch: any;
  isLoading: boolean;
  error: RegisterError | null;
  success: boolean;
  onSubmit: (values: RegisterSchemaType) => Promise<void>;
  onSocialAuth: (provider: 'google' | 'github') => Promise<void>;
  clearError: () => void;
  getErrorMessage: (authError: RegisterError | null) => string;
}

/**
 * Custom hook for registration functionality
 * Manages form state, auth logic, error handling, and translations
 *
 * @returns Register hook methods and state
 */
export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<RegisterError | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Initialize form with validation
   */
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
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
   * Handle form submission with registration
   */
  const onSubmit = useCallback(
    async (values: RegisterSchemaType) => {
      clearError();
      setSuccess(false);

      startTransition(async () => {
        try {
          const result = await registerAction(values);

          if (!result.success) {
            setError({
              message: result.message || 'Registration failed',
              code: result.code,
            });
            return;
          }

          // Registration successful - email verification required before login
          setSuccess(true);

          // Redirect to verification pending page
          const redirectUrl = result.redirectUrl || '/verify-email';
          setTimeout(() => {
            router.push(redirectUrl);
          }, 500);
        } catch (err) {
          console.error('Registration error:', err);
          setError({
            message: 'An unexpected error occurred',
            code: 'UNKNOWN_ERROR',
          });
        }
      });
    },
    [clearError, router],
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
          callbackUrl: '/verify-email',
        });
      } catch (err) {
        console.error(`${provider} auth error:`, err);
        setError({
          message: `Failed to sign up with ${provider}`,
          code: 'OAUTH_ERROR',
        });
      }
    },
    [clearError],
  );

  /**
   * Format error for display
   */
  const getErrorMessage = useCallback((authError: RegisterError | null): string => {
    if (!authError) return '';
    return authError.message;
  }, []);

  return {
    // Form methods
    register: form.register,
    handleSubmit: form.handleSubmit,
    control: form.control,
    watch: form.watch,
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
