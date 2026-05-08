import {
  RegistrationValidator,
  type RegistrationInput,
} from '../domain/validation/registration.validator';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { enqueueVerificationEmail } from '../infrastructure/mail/email.queue';
import { generateVerificationToken } from '../infrastructure/security/token.generator';
import { hashPassword, comparePasswords } from '../infrastructure/security/hash';
import { AuthLogger } from '../infrastructure/logging/structured-logger';
import {
  AuthError,
  DatabaseError,
  DuplicateEmailError,
  TokenAlreadyUsedError,
  TokenExpiredError,
  TokenNotFoundError,
  ValidationError,
} from '../domain/errors';

export interface RegisterResult {
  success: true;
  userId: string;
  email: string;
  verificationToken: string;
  verificationExpiresAt: Date;
}

export interface VerifyEmailResult {
  success: true;
  userId: string;
  email: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  scopes: string[];
}

export class AuthService {
  static async registerUser(input: RegistrationInput): Promise<RegisterResult> {
    try {
      await RegistrationValidator.validate(input);

      const hashedPassword = await hashPassword(input.password);
      const { token: rawToken, hashedToken, expiresAt } = generateVerificationToken();

      const { user, verificationToken } = await UserRepository.createWithVerificationToken(
        {
          email: input.email,
          password: hashedPassword,
          name: input.name,
        },
        {
          rawToken,
          hashedToken,
          expiresAt,
        },
      );

      await enqueueVerificationEmail({
        userId: user.id,
        email: input.email,
        name: user.name || undefined,
        token: rawToken,
        expiresAt: verificationToken.expiresAt,
      });

      AuthLogger.info('user_registered', {
        userId: user.id,
        email: input.email,
      });

      return {
        success: true,
        userId: user.id,
        email: input.email,
        verificationToken: rawToken,
        verificationExpiresAt: verificationToken.expiresAt,
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AuthError) {
        throw error;
      }

      AuthLogger.error('registration_service_error', error as Error);
      throw new DatabaseError('Failed to register user');
    }
  }

  static async verifyEmail(rawToken: string): Promise<VerifyEmailResult> {
    try {
      const result = await UserRepository.verifyEmailWithToken(rawToken);

      AuthLogger.info('email_verified', {
        userId: result.userId,
        email: result.email,
      });

      return {
        success: true,
        userId: result.userId,
        email: result.email,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.message === 'TOKEN_NOT_FOUND') {
          throw new TokenNotFoundError();
        }

        if (error.message === 'TOKEN_EXPIRED') {
          throw new TokenExpiredError();
        }

        if (error.message === 'TOKEN_ALREADY_USED') {
          throw new TokenAlreadyUsedError();
        }
      }

      AuthLogger.error('email_verification_error', error as Error);
      throw new DatabaseError('Failed to verify email');
    }
  }

  static async resendVerificationEmail(email: string): Promise<boolean> {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const existingToken = await UserRepository.getVerificationTokenByEmail(normalizedEmail);

      if (!existingToken) {
        AuthLogger.debug('resend_verification_no_token', {
          email: normalizedEmail,
        });
        return false;
      }

      const { token, hashedToken, expiresAt } = generateVerificationToken();
      const userId = existingToken.userId;

      await UserRepository.createNewVerificationToken(normalizedEmail, {
        hashedToken,
        expiresAt,
        userId,
      });

      await enqueueVerificationEmail({
        userId: userId ?? '',
        email: normalizedEmail,
        token,
        expiresAt,
      });

      AuthLogger.info('resend_verification_email_queued', {
        email: normalizedEmail,
      });

      return true;
    } catch (error) {
      AuthLogger.error('resend_verification_error', error as Error, {
        email,
      });
      return false;
    }
  }

  static async validatePassword(password: string): Promise<boolean> {
    try {
      return password.length >= 12;
    } catch (error) {
      AuthLogger.error('password_validation_error', error as Error);
      return false;
    }
  }

  static async cleanupExpiredTokens(): Promise<number> {
    try {
      const deletedCount = await UserRepository.cleanupExpiredTokens();

      AuthLogger.info('tokens_cleaned_up', {
        deletedCount,
      });

      return deletedCount;
    } catch (error) {
      AuthLogger.error('token_cleanup_error', error as Error);
      throw error;
    }
  }

  static async validateCredentials(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    const user = await UserRepository.findByEmail(email.toLowerCase().trim());
    if (!user || !user.password || !user.role || user.status !== 'ACTIVE') {
      return null;
    }

    const valid = await comparePasswords(password, user.password);
    if (!valid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      role: user.role.name,
      scopes: [],
    };
  }
}

export default AuthService;
