'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from './PasswordInput';
import { SocialButtons } from './SocialButtons';
import { getPasswordStrength, strengthLevels } from '../lib/auth-utils';
import { RegisterSchema } from '../schemas/auth-schemas';

interface RegisterFormProps {
  onSubmit: (values: RegisterSchema) => Promise<void>;
  onSocialAuth: (provider: 'google' | 'github') => void;
}

export function RegisterForm({ onSubmit, onSocialAuth }: RegisterFormProps) {
  const t = useTranslations('auth');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterSchema>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(RegisterSchema as any),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' });
  const strengthScore = getPasswordStrength(passwordValue ?? '');
  const strength = strengthLevels[strengthScore];
  const strengthProgress = `${(strengthScore / (strengthLevels.length - 1)) * 100}%`;

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="register-name">{t('signup.name')}</Label>
          <Input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder={t('form.placeholderName')}
            {...register('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'register-name-error' : undefined}
            className="mt-2"
          />
          {errors.name?.message && (
            <p id="register-name-error" className="mt-2 text-sm text-rose-500">
              {t(errors.name.message as string)}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="register-email">{t('signup.email')}</Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder={t('form.placeholderEmail')}
            {...register('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
            className="mt-2"
          />
          {errors.email?.message && (
            <p id="register-email-error" className="mt-2 text-sm text-rose-500">
              {t(errors.email.message as string)}
            </p>
          )}
        </div>

        <div>
          <PasswordInput
            id="register-password"
            label={t('signup.password')}
            placeholder={t('form.placeholderPasswordCreate')}
            autoComplete="new-password"
            register={register('password')}
            error={errors.password ? t(errors.password.message as string) : undefined}
          />
          <div className="mt-3 rounded-3xl border border-slate-200 bg-white/80 p-3 text-sm dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
              <span>{t('form.passwordStrength')}</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {t(strength.labelKey)}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={`${strength.color} h-full rounded-full transition-all duration-300`}
                style={{ width: strengthProgress }}
              />
            </div>
          </div>
        </div>

        <PasswordInput
          id="register-confirm-password"
          label={t('signup.confirmPassword')}
          placeholder={t('form.placeholderPasswordRepeat')}
          autoComplete="new-password"
          register={register('confirmPassword')}
          error={errors.confirmPassword ? t(errors.confirmPassword.message as string) : undefined}
        />
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full rounded-3xl px-5 py-3 text-base font-semibold tracking-tight transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {isSubmitting ? t('form.creatingAccount') : t('signup.button')}
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
