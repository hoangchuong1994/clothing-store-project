'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginSchema } from './auth-schemas';
import { SocialButtons } from './SocialButtons';

interface LoginFormProps {
  onSubmit: (values: LoginSchema) => Promise<void>;
  onSocialAuth: (provider: 'google' | 'github') => void;
}

export function LoginForm({ onSubmit, onSocialAuth }: LoginFormProps) {
  const t = useTranslations('auth');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginSchema>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(loginSchema as any),
    mode: 'onChange',
    defaultValues: { email: '', password: '', remember: true },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="login-email">{t('signin.email')}</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder={t('form.placeholderEmail')}
            {...register('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            className="mt-2"
          />
          {errors.email?.message && (
            <p id="login-email-error" className="mt-2 text-sm text-rose-500">
              {t(errors.email.message as string)}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">{t('signin.password')}</Label>
            <button
              type="button"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {t('form.forgotPassword')}
            </button>
          </div>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder={t('form.placeholderPassword')}
            {...register('password')}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            className="mt-2 pr-12"
          />
          {errors.password?.message && (
            <p id="login-password-error" className="mt-2 text-sm text-rose-500">
              {t(errors.password.message as string)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              className="text-primary focus:ring-primary/60 h-4 w-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-900"
              {...register('remember')}
            />
            {t('form.rememberMe')}
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full rounded-3xl px-5 py-3 text-base font-semibold tracking-tight transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {isSubmitting ? t('form.signingIn') : t('signin.button')}
        </Button>

        <div className="flex items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          {t('form.orContinueWith')}
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <SocialButtons
          onGoogle={() => onSocialAuth('google')}
          onGitHub={() => onSocialAuth('github')}
        />
      </div>
    </form>
  );
}
