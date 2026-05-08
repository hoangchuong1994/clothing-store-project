/**
 * Rate limiting for auth endpoints
 * Using Upstash Redis for serverless rate limiting
 *
 * Phase 2: Core rate limiting
 * Prevents brute force and spam
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { RateLimitError } from '../errors/auth.errors';

/**
 * Initialize Redis client for rate limiting
 * Gracefully handle missing configuration in development
 */
let redis: Redis | null = null;
let rateLimitEnabled = false;

try {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (
    redisUrl &&
    redisToken &&
    redisUrl !== 'https://your-redis-instance.upstash.io' &&
    redisToken !== 'your-redis-token-here'
  ) {
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
    rateLimitEnabled = true;
  } else {
    console.warn('[RateLimit] Redis not configured - rate limiting disabled');
  }
} catch (error) {
  console.warn('[RateLimit] Failed to initialize Redis:', error);
}

/**
 * Rate limiter instances - only created if Redis is available
 */
let registerLimiter: Ratelimit | null = null;
let resendLimiter: Ratelimit | null = null;
let verifyLimiter: Ratelimit | null = null;
let loginLimiter: Ratelimit | null = null;

if (rateLimitEnabled && redis) {
  registerLimiter = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '1s'),
    analytics: true,
    prefix: 'ratelimit:register',
  });

  resendLimiter = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(3, '1h'),
    analytics: true,
    prefix: 'ratelimit:resend',
  });

  verifyLimiter = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '1h'),
    analytics: true,
    prefix: 'ratelimit:verify',
  });

  loginLimiter = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '15m'),
    analytics: true,
    prefix: 'ratelimit:login',
  });
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  retryAfter?: number; // Seconds
}

/**
 * Check registration rate limit by IP
 */
export async function checkRegisterRateLimit(ip: string): Promise<RateLimitResult> {
  // If rate limiting is disabled, allow all requests
  if (!rateLimitEnabled || !registerLimiter) {
    return {
      success: true,
      limit: 5,
      remaining: 5,
      reset: Date.now() + 3600000,
    };
  }

  try {
    const { success, limit, remaining, reset, pending } = await registerLimiter.limit(ip);

    if (!success) {
      throw new RateLimitError(reset ? Math.ceil((reset - Date.now()) / 1000) : undefined);
    }

    return {
      success,
      limit,
      remaining,
      reset: reset || Date.now(),
    };
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error('[RateLimit] Registration check failed:', error);
    // Fail open on rate limiter error (allow request)
    return {
      success: true,
      limit: 5,
      remaining: 5,
      reset: Date.now() + 3600000,
    };
  }
}

/**
 * Check resend verification email rate limit
 */
export async function checkResendRateLimit(email: string): Promise<RateLimitResult> {
  // If rate limiting is disabled, allow all requests
  if (!rateLimitEnabled || !resendLimiter) {
    return {
      success: true,
      limit: 3,
      remaining: 3,
      reset: Date.now() + 3600000,
    };
  }

  try {
    const { success, limit, remaining, reset } = await resendLimiter.limit(
      `resend:${email.toLowerCase()}`,
    );

    if (!success) {
      throw new RateLimitError(reset ? Math.ceil((reset - Date.now()) / 1000) : undefined);
    }

    return {
      success,
      limit,
      remaining,
      reset: reset || Date.now(),
    };
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error('[RateLimit] Resend check failed:', error);
    return {
      success: true,
      limit: 3,
      remaining: 3,
      reset: Date.now() + 3600000,
    };
  }
}

/**
 * Check email verification rate limit
 */
export async function checkVerifyRateLimit(ip: string): Promise<RateLimitResult> {
  // If rate limiting is disabled, allow all requests
  if (!rateLimitEnabled || !verifyLimiter) {
    return {
      success: true,
      limit: 10,
      remaining: 10,
      reset: Date.now() + 3600000,
    };
  }

  try {
    const { success, limit, remaining, reset } = await verifyLimiter.limit(`verify:${ip}`);

    if (!success) {
      throw new RateLimitError(reset ? Math.ceil((reset - Date.now()) / 1000) : undefined);
    }

    return {
      success,
      limit,
      remaining,
      reset: reset || Date.now(),
    };
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error('[RateLimit] Verify check failed:', error);
    return {
      success: true,
      limit: 10,
      remaining: 10,
      reset: Date.now() + 3600000,
    };
  }
}

/**
 * Check login rate limit
 */
export async function checkLoginRateLimit(ip: string): Promise<RateLimitResult> {
  // If rate limiting is disabled, allow all requests
  if (!rateLimitEnabled || !loginLimiter) {
    return {
      success: true,
      limit: 5,
      remaining: 5,
      reset: Date.now() + 900000,
    };
  }

  try {
    const { success, limit, remaining, reset } = await loginLimiter.limit(`login:${ip}`);

    if (!success) {
      throw new RateLimitError(reset ? Math.ceil((reset - Date.now()) / 1000) : undefined);
    }

    return {
      success,
      limit,
      remaining,
      reset: reset || Date.now(),
    };
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error('[RateLimit] Login check failed:', error);
    return {
      success: true,
      limit: 5,
      remaining: 5,
      reset: Date.now() + 900000,
    };
  }
}

/**
 * Get rate limit status (for debugging)
 */
export async function getRateLimitStatus(key: string) {
  // If Redis is not available, return null
  if (!redis) {
    return null;
  }

  try {
    // This requires direct Redis access
    const value = await redis.get(`ratelimit:${key}`);
    return value;
  } catch (error) {
    console.error('[RateLimit] Status check failed:', error);
    return null;
  }
}
