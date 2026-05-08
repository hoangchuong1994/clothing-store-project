/**
 * Inngest integration for background jobs
 * Phase 3: Async email processing with automatic retries
 *
 * This replaces the simple email.queue.ts from Phase 1/2
 */

import { Inngest } from 'inngest';

/**
 * Inngest client for background jobs
 */
export const inngest = new Inngest({
  id: 'clothing-store-auth',
});

/**
 * Queue verification email via Inngest
 * Replaces Phase 1/2 simple queue
 *
 * Features:
 * ✅ Automatic retries (3x with exponential backoff)
 * ✅ Error tracking
 * ✅ Delayed execution
 * ✅ Deduplication
 */
export async function queueVerificationEmail(data: {
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  name?: string;
}) {
  return inngest.send({
    name: 'auth/send.verification_email',
    data: {
      userId: data.userId,
      email: data.email,
      token: data.token,
      expiresAt: data.expiresAt.toISOString(),
      name: data.name,
    },
  });
}

/**
 * Queue password reset email via Inngest
 */
export async function queuePasswordResetEmail(data: {
  userId: string;
  email: string;
  token: string;
  name?: string;
}) {
  return inngest.send({
    name: 'auth/send.password_reset_email',
    data: {
      userId: data.userId,
      email: data.email,
      token: data.token,
      name: data.name,
    },
  });
}

/**
 * Trigger token cleanup via Inngest
 */
export async function triggerTokenCleanup() {
  return inngest.send({
    name: 'auth/cleanup.expired_tokens',
    data: {},
  });
}
