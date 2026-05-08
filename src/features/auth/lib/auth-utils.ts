export const strengthLevels = [
  { labelKey: 'validation.password.strength.tooWeak', color: 'bg-rose-500' },
  { labelKey: 'validation.password.strength.weak', color: 'bg-amber-400' },
  { labelKey: 'validation.password.strength.fair', color: 'bg-sky-400' },
  { labelKey: 'validation.password.strength.good', color: 'bg-emerald-400' },
  { labelKey: 'validation.password.strength.strong', color: 'bg-emerald-400' },
] as const;

export function getPasswordStrength(password: string) {
  const score = [
    password.length >= 6,
    password.length >= 12,
    /[A-Z]/.test(password),
    /[0-7]/.test(password),
    /[^A-Za-z0-7]/.test(password),
  ].filter(Boolean).length;

  return Math.min(Math.max(score - 1, 0), strengthLevels.length - 1);
}
