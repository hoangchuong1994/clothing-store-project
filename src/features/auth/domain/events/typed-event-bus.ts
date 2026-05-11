import type { AuthEvent, AuthEventName } from './auth-event';

export interface TypedDomainEvent<
  TName extends AuthEventName = AuthEventName,
  TPayload = Record<string, unknown>,
> extends AuthEvent<TPayload> {
  name: TName;
}

export interface TypedEventHandler<T extends TypedDomainEvent> {
  handle(event: T): Promise<void>;
}

export interface TypedEventBus {
  publish<E extends TypedDomainEvent>(event: E): Promise<void>;
  subscribe<E extends TypedDomainEvent>(eventName: E['name'], handler: TypedEventHandler<E>): void;
}

export class InMemoryTypedEventBus implements TypedEventBus {
  private handlers = new Map<string, Array<TypedEventHandler<TypedDomainEvent>>>();

  public async publish<E extends TypedDomainEvent>(event: E): Promise<void> {
    const handlers = this.handlers.get(event.name) ?? [];
    await Promise.all(handlers.map((handler) => handler.handle(event as E)));
  }

  public subscribe<E extends TypedDomainEvent>(
    eventName: E['name'],
    handler: TypedEventHandler<E>,
  ): void {
    const existing = this.handlers.get(eventName) ?? [];
    this.handlers.set(eventName, [...existing, handler as TypedEventHandler<TypedDomainEvent>]);
  }
}
