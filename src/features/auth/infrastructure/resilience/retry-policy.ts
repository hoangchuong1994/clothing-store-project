export interface RetryPolicyOptions {
  retries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  jitter?: boolean;
}

export async function retry<T>(
  operation: () => Promise<T>,
  options: RetryPolicyOptions,
): Promise<T> {
  let attempt = 0;
  let delay = options.initialDelayMs;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      attempt += 1;
      if (attempt > options.retries) {
        throw error;
      }
      const backoff = options.jitter
        ? Math.min(options.maxDelayMs, delay * 2 * (1 + Math.random()))
        : delay;
      await new Promise((resolve) => setTimeout(resolve, backoff));
      delay = Math.min(options.maxDelayMs, delay * 2);
    }
  }
}
