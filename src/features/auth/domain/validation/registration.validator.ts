import { z } from 'zod';
import { ValidationError } from '../exceptions/auth.exceptions';
import { RegisterSchema } from './auth-schemas';
import {
  hasCommonPasswordPattern,
  hasContextualPasswordInfo,
  isDisposableEmail,
  isPasswordStrongEnough,
} from './password-rules';

export type RegistrationInput = z.infer<typeof RegisterSchema>;

export class RegistrationValidator {
  static async validate(input: unknown): Promise<RegistrationInput> {
    let parsed: RegistrationInput;

    try {
      parsed = RegisterSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map((issue) => ({
          field: issue.path.join('.') || 'email',
          message: issue.message,
        }));
        throw new ValidationError(issues, 'Invalid registration input');
      }
      throw error;
    }

    if (hasCommonPasswordPattern(parsed.password)) {
      throw new ValidationError(
        [{ field: 'password', message: 'password.commonPattern' }],
        'Password contains common patterns',
      );
    }

    if (hasContextualPasswordInfo(parsed.password, parsed.email, parsed.name)) {
      throw new ValidationError(
        [{ field: 'password', message: 'password.containsPersonalInfo' }],
        'Password contains personal information',
      );
    }

    if (isDisposableEmail(parsed.email)) {
      throw new ValidationError(
        [{ field: 'email', message: 'email.disposable' }],
        'Disposable email addresses are not allowed',
      );
    }

    const hasGoodStrength = await isPasswordStrongEnough(parsed.password);
    if (!hasGoodStrength) {
      throw new ValidationError(
        [{ field: 'password', message: 'password.weak' }],
        'Password not strong enough',
      );
    }

    return parsed;
  }
}
