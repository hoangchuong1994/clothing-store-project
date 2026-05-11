import type { EventBusPort } from '../../application/ports/event-bus.port';

export class NoopEventBusAdapter implements EventBusPort {
  public async publish(eventName: string, payload: Record<string, unknown>): Promise<void> {
    console.debug('[NoopEventBus] publish', eventName, payload);
  }
}
