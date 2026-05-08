/**
 * Inngest job handlers
 * Phase 3: Background job workers
 *
 * These run asynchronously and are automatically retried
 */

import { inngest } from './inngest';
import { sendVerificationEmail, sendVerificationForgotPassword } from '../lib/mail';
import { UserRepository } from '../repositories/user.repository';
import { AuthLogger } from '../lib/structured-logger';

/**
 * Handle verification email sending
 *
 * Inngest features:
 * - Automatic retries (3x)
 * - Exponential backoff
 * - Error logging
 * - Monitoring integration
 */
export const sendVerificationEmailHandler = inngest.createFunction(
  {
    id: 'auth-send-verification-email',
    name: 'Send Verification Email',
    triggers: [{ event: 'auth/send.verification_email' }],
    retries: 3,
  },
  async ({ event, attempt }) => {
    try {
      AuthLogger.info('send_verification_email_started', {
        userId: event.data.userId,
        email: event.data.email,
        attempt,
      });

      // Send email
      await sendVerificationEmail({
        email: event.data.email,
        token: event.data.token,
        name: event.data.name,
      });

      // Mark token as sent (optional, for tracking)
      AuthLogger.info('send_verification_email_success', {
        userId: event.data.userId,
        email: event.data.email,
      });

      return {
        success: true,
        userId: event.data.userId,
      };
    } catch (error) {
      AuthLogger.error('send_verification_email_failed', error as Error, {
        userId: event.data.userId,
        email: event.data.email,
        attempt,
      });

      // Inngest will automatically retry based on retry config
      throw error;
    }
  },
);

/**
 * Handle password reset email sending
 */
export const sendPasswordResetEmailHandler = inngest.createFunction(
  {
    id: 'auth-send-password-reset-email',
    name: 'Send Password Reset Email',
    triggers: [{ event: 'auth/send.password_reset_email' }],
    retries: 3,
  },
  async ({ event, attempt }) => {
    try {
      AuthLogger.info('send_password_reset_email_started', {
        userId: event.data.userId,
        email: event.data.email,
        attempt,
      });

      await sendVerificationForgotPassword(event.data.email, event.data.token);

      AuthLogger.info('send_password_reset_email_success', {
        userId: event.data.userId,
        email: event.data.email,
      });

      return {
        success: true,
        userId: event.data.userId,
      };
    } catch (error) {
      AuthLogger.error('send_password_reset_email_failed', error as Error, {
        userId: event.data.userId,
        email: event.data.email,
        attempt,
      });

      throw error;
    }
  },
);

/**
 * Handle token cleanup (daily scheduled job)
 *
 * Inngest cron:
 * - Runs daily at 2 AM UTC
 * - Deletes expired tokens
 * - Sends alerts if cleanup fails
 */
export const cleanupExpiredTokensHandler = inngest.createFunction(
  {
    id: 'auth-cleanup-tokens',
    name: 'Cleanup Expired Tokens',
    triggers: [{ cron: 'TZ=UTC 0 2 * * *' }],
    retries: 3,
  },
  async ({ event, logger }) => {
    const startTime = Date.now();

    try {
      logger.info('Token cleanup started');

      // Delete expired tokens
      const deletedCount = await UserRepository.cleanupExpiredTokens();
      const duration = Date.now() - startTime;

      logger.info(`Token cleanup completed: ${deletedCount} tokens deleted in ${duration}ms`);

      return {
        success: true,
        deletedCount,
        duration,
      };
    } catch (error) {
      AuthLogger.critical('token_cleanup_failed', error as Error, {
        duration: Date.now() - startTime,
      });

      // Inngest will retry on failure
      throw error;
    }
  },
);

/**
 * Export all handlers
 */
export const authJobHandlers = {
  sendVerificationEmailHandler,
  sendPasswordResetEmailHandler,
  cleanupExpiredTokensHandler,
};
