/**
 * User repository with atomic transaction support
 * Ensures data consistency for critical operations
 */

import prisma from '@/lib/server/prisma/prisma';
import { DatabaseError } from '../../domain/exceptions/auth.exceptions';
import { DuplicateEmailError } from '../../domain/exceptions/auth.exceptions';
import { hashToken } from '../security/token.generator';

export interface CreateUserWithVerificationInput {
  email: string;
  password: string;
  name: string;
}

export interface CreateUserWithVerificationResult {
  user: {
    id: string;
    email: string | null;
    name: string | null;
  };
  verificationToken: {
    token: string; // Hashed token
    expiresAt: Date;
  };
}

export class UserRepository {
  /**
   * Create user with verification token atomically
   * CRITICAL: All-or-nothing operation
   *
   * Transaction ensures:
   * - User is created
   * - Verification token is created
   * - OR everything rolls back if any operation fails
   */
  static async createWithVerificationToken(
    input: CreateUserWithVerificationInput,
    tokenData: {
      rawToken: string; // Raw token to return to caller
      hashedToken: string; // Token hash to store in DB
      expiresAt: Date;
    },
  ): Promise<CreateUserWithVerificationResult> {
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          // 1. Optimistic check - race condition handled by UNIQUE constraint
          const existingUser = await tx.user.findUnique({
            where: { email: input.email },
          });

          if (existingUser) {
            throw new DuplicateEmailError(input.email);
          }

          // 2. Create user (not verified yet)
          const user = await tx.user.create({
            data: {
              email: input.email,
              password: input.password, // Should be hashed before calling this!
              name: input.name,
              emailVerified: null, // IMPORTANT: Not verified
              role: {
                connect: {
                  name: 'CUSTOMER',
                },
              },
            },
            select: {
              id: true,
              email: true,
              name: true,
            },
          });

          // 3. Create verification token (tied to user)
          const verificationToken = await tx.verificationToken.create({
            data: {
              email: input.email,
              token: tokenData.hashedToken,
              expires: tokenData.expiresAt,
              sentAt: null,
              usedAt: null,
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
            select: {
              token: true,
              expires: true,
            },
          });

          return {
            user,
            verificationToken,
            rawToken: tokenData.rawToken, // Return raw token to send
          };
        },
        {
          timeout: 10000, // 10 second timeout
          maxWait: 5000, // Wait max 5 seconds to acquire lock
        },
      );

      return {
        user: result.user,
        verificationToken: {
          token: result.rawToken, // Return raw token (for email)
          expiresAt: result.verificationToken.expires,
        },
      };
    } catch (error) {
      if (error instanceof DuplicateEmailError) {
        throw error; // Re-throw known errors
      }

      // Wrap other database errors
      console.error('Error creating user with verification token:', error);
      throw new DatabaseError('Failed to create user. Please try again later.');
    }
  }

  /**
   * Verify user email with token (atomic)
   * One-time use token verification
   */
  static async verifyEmailWithToken(rawToken: string): Promise<{ userId: string; email: string }> {
    try {
      const hashedToken = hashToken(rawToken);

      const result = await prisma.$transaction(
        async (tx) => {
          // 1. Find token by hash
          const verificationToken = await tx.verificationToken.findUnique({
            where: { token: hashedToken },
            include: { user: true },
          });

          if (!verificationToken) {
            throw new Error('TOKEN_NOT_FOUND');
          }

          // 2. Check expiration
          if (new Date() > verificationToken.expires) {
            throw new Error('TOKEN_EXPIRED');
          }

          // 3. Check already used
          if (verificationToken.usedAt) {
            throw new Error('TOKEN_ALREADY_USED');
          }

          // 4. Mark token as used
          await tx.verificationToken.update({
            where: { id: verificationToken.id },
            data: { usedAt: new Date() },
          });

          // 5. Verify user email
          const user = await tx.user.update({
            where: { email: verificationToken.email },
            data: { emailVerified: new Date() },
          });

          return {
            userId: user.id,
            email: user.email || '',
          };
        },
        {
          timeout: 5000,
          maxWait: 2000,
        },
      );

      return result;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'TOKEN_NOT_FOUND') {
          throw new Error('VERIFICATION_TOKEN_NOT_FOUND');
        }
        if (error.message === 'TOKEN_EXPIRED') {
          throw new Error('VERIFICATION_TOKEN_EXPIRED');
        }
        if (error.message === 'TOKEN_ALREADY_USED') {
          throw new Error('VERIFICATION_TOKEN_ALREADY_USED');
        }
      }

      console.error('Error verifying email token:', error);
      throw new DatabaseError('Email verification failed');
    }
  }

  /**
   * Find user by email (case-insensitive)
   */
  static async findByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { role: true },
      });
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  /**
   * Get verification token for user (for resend logic)
   */
  static async getVerificationTokenByEmail(email: string) {
    try {
      return await prisma.verificationToken.findFirst({
        where: {
          email: email.toLowerCase(),
          usedAt: null, // Not yet used
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error getting verification token:', error);
      return null;
    }
  }

  /**
   * Create new verification token (for resend)
   * Deletes old tokens first
   */
  static async createNewVerificationToken(
    email: string,
    tokenData: {
      hashedToken: string;
      expiresAt: Date;
      userId?: string | null;
    },
  ) {
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.verificationToken.deleteMany({
          where: {
            email: email.toLowerCase(),
            usedAt: null,
          },
        });

        return await tx.verificationToken.create({
          data: {
            email: email.toLowerCase(),
            token: tokenData.hashedToken,
            expires: tokenData.expiresAt,
            sentAt: null,
            usedAt: null,
            user: tokenData.userId
              ? {
                  connect: {
                    id: tokenData.userId,
                  },
                }
              : undefined,
          },
        });
      });
    } catch (error) {
      console.error('Error creating new verification token:', error);
      throw new DatabaseError('Failed to create verification token');
    }
  }

  /**
   * Clean up expired verification tokens
   * Should run daily via cron job
   */
  static async cleanupExpiredTokens(): Promise<number> {
    try {
      const result = await prisma.verificationToken.deleteMany({
        where: {
          expires: {
            lt: new Date(),
          },
        },
      });

      console.log(`[Auth Cleanup] Deleted ${result.count} expired verification tokens`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error);
      throw new DatabaseError('Cleanup operation failed');
    }
  }
}
