import { useTranslations } from 'next-intl';
import type { PasswordStrengthResult } from '../hooks/usePasswordStrength';

interface PasswordStrengthProps {
  strength: PasswordStrengthResult;
  className?: string;
}

/**
 * Password strength indicator component
 * Displays visual feedback for password strength with animations
 */
export function PasswordStrength({ strength, className }: PasswordStrengthProps) {
  const t = useTranslations('auth');
  const tv = useTranslations('validation');

  const levelConfig: Record<PasswordStrengthResult['level'], { labelKey: string; color: string }> =
    {
      weak: { labelKey: 'password.strength.weak', color: 'bg-rose-500' },
      fair: { labelKey: 'password.strength.fair', color: 'bg-orange-500' },
      good: { labelKey: 'password.strength.good', color: 'bg-amber-500' },
      strong: { labelKey: 'password.strength.strong', color: 'bg-emerald-500' },
      'very strong': { labelKey: 'password.strength.strong', color: 'bg-sky-500' },
    };

  const level = levelConfig[strength.level];

  return (
    <div
      className={`mt-3 rounded-3xl border border-slate-200 bg-white/80 p-3 text-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950/80 ${className}`}
    >
      <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
        <span>{t('form.passwordStrength')}</span>
        <span
          className={`font-semibold ${
            strength.isValid
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {tv(level.labelKey)}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`${level.color} h-full rounded-full transition-[width] duration-300 ease-out`}
          style={{ width: strength.progress }}
        />
      </div>
    </div>
  );
}
