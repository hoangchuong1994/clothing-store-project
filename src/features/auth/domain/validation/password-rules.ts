export const COMMON_PASSWORD_PATTERNS = [
  'password',
  '123456',
  'qwerty',
  'abc123',
  '111111',
  'password123',
  'admin',
  'letmein',
  'welcome',
  'monkey',
  'dragon',
  'master',
  'sunshine',
  'princess',
  'shadow',
  'michael',
  'football',
] as const;

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'trashmail.com',
  'yopmail.com',
]);

export function hasCommonPasswordPattern(password: string): boolean {
  const normalized = password.toLowerCase();
  return COMMON_PASSWORD_PATTERNS.some((pattern) => normalized.includes(pattern));
}

export function hasContextualPasswordInfo(password: string, email: string, name: string): boolean {
  const normalized = password.toLowerCase();
  const emailLocal = email.split('@')[0].toLowerCase();
  return (
    normalized.includes(emailLocal) ||
    normalized.includes(name.toLowerCase()) ||
    normalized.includes(name.split(' ')[0].toLowerCase())
  );
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? DISPOSABLE_EMAIL_DOMAINS.has(domain) : false;
}

export async function isPasswordStrongEnough(password: string): Promise<boolean> {
  try {
    const { default: zxcvbn } = await import('zxcvbn-typescript');
    const result = zxcvbn(password);
    return result.score >= 3;
  } catch (error) {
    console.warn('[PasswordRules] zxcvbn unavailable, falling back to length check:', error);
    return password.length >= 12;
  }
}
