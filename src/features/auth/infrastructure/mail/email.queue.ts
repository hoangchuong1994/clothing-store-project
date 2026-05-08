/**
 * Email queue service
 * Phase 3: Inngest background job queue with automatic retries
 */

import { queueVerificationEmail as queueVerificationEmailJob } from '../../jobs/inngest';

interface VerificationEmailData {
  userId: string;
  email: string;
  name?: string;
  token: string;
  expiresAt: Date;
}

/**
 * Queue verification email via Inngest
 * This is non-blocking and durable.
 */
export async function enqueueVerificationEmail(data: VerificationEmailData): Promise<void> {
  try {
    await queueVerificationEmailJob({
      userId: data.userId,
      email: data.email,
      token: data.token,
      expiresAt: data.expiresAt,
      name: data.name,
    });
  } catch (error) {
    console.error('[Email Queue] Failed to queue verification email:', {
      userId: data.userId,
      email: data.email,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
