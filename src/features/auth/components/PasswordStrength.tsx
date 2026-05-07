import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`mt-3 rounded-3xl border border-slate-200 bg-white/80 p-3 text-sm dark:border-slate-800 dark:bg-slate-950/80 ${className}`}
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
          {t(strength.level.labelKey)}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <motion.div
          className={`${strength.level.color} h-full rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: strength.progress }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
