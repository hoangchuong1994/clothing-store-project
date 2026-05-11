export interface MetricsPort {
  increment(metricName: string, value?: number, tags?: Record<string, string>): Promise<void>;
  gauge(metricName: string, value: number, tags?: Record<string, string>): Promise<void>;
}
