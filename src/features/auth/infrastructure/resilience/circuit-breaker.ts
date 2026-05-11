export interface CircuitBreakerOptions {
  failureThreshold: number;
  successThreshold: number;
  timeoutMs: number;
}

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private failureCount = 0;
  private successCount = 0;
  private state: CircuitState = 'CLOSED';
  private nextAttempt = Date.now();

  constructor(private readonly options: CircuitBreakerOptions) {}

  public async execute<T>(action: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN' && Date.now() < this.nextAttempt) {
      throw new Error('Circuit breaker opened');
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.successCount += 1;
    if (this.state === 'HALF_OPEN' && this.successCount >= this.options.successThreshold) {
      this.reset();
    }
  }

  private onFailure(): void {
    this.failureCount += 1;
    if (this.failureCount >= this.options.failureThreshold) {
      this.open();
    }
  }

  private open(): void {
    this.state = 'OPEN';
    this.nextAttempt = Date.now() + this.options.timeoutMs;
    this.successCount = 0;
  }

  private reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
  }
}
