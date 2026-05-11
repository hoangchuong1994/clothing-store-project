export interface EventBusPort {
  publish(eventName: string, payload: Record<string, unknown>): Promise<void>;
}
