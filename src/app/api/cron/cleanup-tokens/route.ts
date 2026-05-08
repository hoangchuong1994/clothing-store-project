/**
 * Token cleanup cron job
 * Runs daily to delete expired verification tokens
 *
 * Phase 2: Database maintenance
 * Prevents database bloat
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { triggerTokenCleanup } from '@/features/auth/jobs/inngest';
import { AuthLogger } from '@/features/auth/infrastructure/logging/structured-logger';

/**
 * Cron job endpoint
 * Call with: curl https://your-app.vercel.app/api/cron/cleanup-tokens
 *
 * Vercel Cron: Add to vercel.json
 * {
 *   "crons": [{
 *     "path": "/api/cron/cleanup-tokens",
 *     "schedule": "0 2 * * *"  // Daily at 2 AM
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify request is from Vercel
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    AuthLogger.info('cron_cleanup_triggered', {
      source: 'vercel_cron',
    });

    await triggerTokenCleanup();

    return NextResponse.json({
      success: true,
      message: 'Token cleanup job queued',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron] Token cleanup failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * Manual trigger for cleanup (POST to trigger immediately)
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    AuthLogger.info('manual_cleanup_triggered', {
      source: 'api_manual',
    });

    await triggerTokenCleanup();

    return NextResponse.json({
      success: true,
      message: 'Token cleanup job queued',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Manual cleanup failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
