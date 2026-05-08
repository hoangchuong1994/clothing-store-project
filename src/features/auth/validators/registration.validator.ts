/**
 * Backend registration validation
 * Comprehensive security checks beyond client-side validation
 */

import { z } from 'zod';
import type { zxcvbn } from 'zxcvbn-typescript';
import { ValidationError } from '../errors/auth.errors';

/**
 * Common password patterns to reject
 */
const COMMON_PASSWORD_PATTERNS = [
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
];

/**
 * Disposable email domains to block (optional)
 */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'trashmail.com',
  'yopmail.com',
]);

/**
 * Backend registration input schema
 * Stricter than client-side schema
 */
export const registrationInputSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email format').max(254, 'Email too long'),

  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password too long'),

  name: z.string().trim().min(2, 'Name too short').max(100, 'Name too long'),
});

export type RegistrationInput = z.infer<typeof registrationInputSchema>;

/**
 * Backend-only validators
 * These provide additional security checks
 */
export class RegistrationValidator {
  /**
   * Check if password contains common patterns
   */
  private static hasCommonPatterns(password: string): boolean {
    const lowerPassword = password.toLowerCase();
    return COMMON_PASSWORD_PATTERNS.some((pattern) => lowerPassword.includes(pattern));
  }

  /**
   * Check if password contains email or name (context-based)
   */
  private static hasContextualInfo(password: string, email: string, name: string): boolean {
    const lowerPassword = password.toLowerCase();
    const emailLocal = email.split('@')[0].toLowerCase();

    return lowerPassword.includes(emailLocal) || lowerPassword.includes(name.toLowerCase());
  }

  /**
   * Check if email is from disposable provider
   */
  private static isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1];
    return DISPOSABLE_EMAIL_DOMAINS.has(domain);
  }

  /**
   * Check password entropy using zxcvbn
   * Requires dynamic import due to bundle size
   */
  private static async checkPasswordStrength(password: string): Promise<boolean> {
    try {
      // Dynamic import to avoid bloating bundle
      const { default: zxcvbn } =
        (await import('zxcvbn-typescript')) as typeof import('zxcvbn-typescript');

      const result = zxcvbn(password);
      // Score: 0=too weak, 1=weak, 2=fair, 3=good, 4=strong
      // Require at least "good" strength (3)
      return result.score >= 3;
    } catch (error) {
      // If zxcvbn fails, only require minimum length
      console.error('Password strength check failed:', error);
      return true; // Allow as fallback
    }
  }

  /**
   * Validate registration input with all security checks
   * Throws ValidationError with detailed field-level feedback
   */
  static async validate(input: unknown): Promise<RegistrationInput> {
    // 1. Parse/coerce input
    let parsed: RegistrationInput;
    try {
      parsed = registrationInputSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new ValidationError(errors, 'Invalid input format');
      }
      throw error;
    }

    // 2. Check for common patterns
    if (this.hasCommonPatterns(parsed.password)) {
      throw new ValidationError(
        [
          {
            field: 'password',
            message: 'Password contains common patterns',
          },
        ],
        'Password too weak',
      );
    }

    // 3. Check for contextual information (email/name in password)
    if (this.hasContextualInfo(parsed.password, parsed.email, parsed.name)) {
      throw new ValidationError(
        [
          {
            field: 'password',
            message: 'Password cannot contain email or name',
          },
        ],
        'Password too weak',
      );
    }

    // 4. Check for disposable email (optional - can be removed if too strict)
    if (this.isDisposableEmail(parsed.email)) {
      throw new ValidationError(
        [
          {
            field: 'email',
            message: 'Disposable email addresses not allowed',
          },
        ],
        'Invalid email provider',
      );
    }

    // 5. Check password entropy (async)
    const hasGoodStrength = await this.checkPasswordStrength(parsed.password);
    if (!hasGoodStrength) {
      throw new ValidationError(
        [
          {
            field: 'password',
            message: 'Password not strong enough',
          },
        ],
        'Password too weak',
      );
    }

    return parsed;
  }
}
