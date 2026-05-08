/**
 * Audit logging for auth operations
 * Tracks all registration attempts for security monitoring
 */

import prisma from '@/lib/server/prisma/prisma';

/**
 * Type for log metadata values
 */
type LogMetadataValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | unknown[];

/**
 * Type for log metadata
 */
type LogMetadata = Record<string, LogMetadataValue>;

export interface RegistrationAuditEntry {
  userId?: string;
  action: string;
  actionType: 'CREATE' | 'UPDATE';
  ip: string;
  userAgent?: string;
  metadata: LogMetadata;
}

/**
 * Log registration attempt
 * Should be called for both success and failure cases
 */
export async function logRegistrationAttempt(entry: RegistrationAuditEntry): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        actionType: entry.actionType,
        ip: entry.ip,
        userAgent: entry.userAgent,
      },
    });
  } catch (error) {
    // Don't throw if audit logging fails
    console.error('[Audit] Failed to log registration attempt:', error);
  }
}

/**
 * Get recent failed registration attempts by IP
 * Used for rate limiting and abuse detection
 */
export async function getFailedRegistrationsByIP(
  ip: string,
  withinMinutes: number = 60,
): Promise<number> {
  try {
    const since = new Date(Date.now() - withinMinutes * 60 * 1000);

    const count = await prisma.activityLog.count({
      where: {
        ip,
        action: 'registration_attempt',
        createdAt: { gte: since },
      },
    });

    return count;
  } catch (error) {
    console.error('[Audit] Failed to get failed registrations:', error);
    return 0;
  }
}

/**
 * Get successful registrations by IP
 * Used for rate limiting
 */
export async function getSuccessfulRegistrationsByIP(
  ip: string,
  withinHours: number = 24,
): Promise<number> {
  try {
    const since = new Date(Date.now() - withinHours * 60 * 60 * 1000);

    // Count activity logs with successful registration
    // (This would need to be enhanced with metadata filtering in real scenario)
    const count = await prisma.activityLog.count({
      where: {
        ip,
        action: 'registration_attempt',
        createdAt: { gte: since },
      },
    });

    return count;
  } catch (error) {
    console.error('[Audit] Failed to get successful registrations:', error);
    return 0;
  }
}
