import type { MetricsPort } from '../../application/ports/metrics.port';

export class NoopMetricsAdapter implements MetricsPort {
  public async increment(
    metricName: string,
    value = 1,
    tags?: Record<string, string>,
  ): Promise<void> {
    console.debug('[NoopMetrics] increment', metricName, value, tags);
  }

  public async gauge(
    metricName: string,
    value: number,
    tags?: Record<string, string>,
  ): Promise<void> {
    console.debug('[NoopMetrics] gauge', metricName, value, tags);
  }
}
