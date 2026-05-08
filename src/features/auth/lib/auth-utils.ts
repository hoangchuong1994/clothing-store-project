export const strengthLevels = [
  { labelKey: 'password.strength.tooWeak', color: 'bg-rose-500' },
  { labelKey: 'password.strength.weak', color: 'bg-amber-400' },
  { labelKey: 'password.strength.fair', color: 'bg-sky-400' },
  { labelKey: 'password.strength.good', color: 'bg-emerald-400' },
  { labelKey: 'password.strength.strong', color: 'bg-emerald-400' },
] as const;

export function getPasswordStrength(password: string) {
  const score = [
    password.length >= 8,
    password.length >= 12,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  return Math.min(Math.max(score - 1, 0), strengthLevels.length - 1);
}
