export interface TraceSpanContext {
  traceId: string;
  spanId: string;
  parentId?: string;
  sampleRate?: number;
}

export interface AuthTracingService {
  startSpan(name: string, context?: Partial<TraceSpanContext>): Promise<TraceSpan>;
}

export interface TraceSpan {
  end(metadata?: Record<string, unknown>): Promise<void>;
  recordError(error: unknown): Promise<void>;
}

export class NoopAuthTracingService implements AuthTracingService {
  async startSpan(): Promise<TraceSpan> {
    return {
      async end(): Promise<void> {
        return;
      },
      async recordError(): Promise<void> {
        return;
      },
    };
  }
}
