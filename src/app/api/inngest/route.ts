/**
 * Inngest API route
 * Phase 3: Webhook receiver for job processing
 *
 * Inngest calls this endpoint to:
 * - Receive job definitions
 * - Send job events
 * - Return job results
 */

import { serve } from 'inngest/next';
import { inngest } from '@/features/auth/jobs/inngest';
import {
  sendVerificationEmailHandler,
  sendPasswordResetEmailHandler,
  cleanupExpiredTokensHandler,
} from '@/features/auth/jobs/handlers';

/**
 * Serve Inngest functions
 * All auth job handlers are registered here
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    sendVerificationEmailHandler,
    sendPasswordResetEmailHandler,
    cleanupExpiredTokensHandler,
  ],
});
