import type { AuthEventDispatcher } from '../../domain/events/auth-event';

export interface BackgroundJobOrchestratorConfig {
  dispatcher: AuthEventDispatcher;
}

export class BackgroundJobOrchestrator {
  constructor(private readonly config: BackgroundJobOrchestratorConfig) {}

  public async scheduleEmailVerification(userId: string, email: string): Promise<void> {
    await this.config.dispatcher.dispatch({
      name: 'USER_REGISTERED',
      payload: { userId, email },
      occurredAt: new Date().toISOString(),
    });
  }

  public async scheduleSessionRevoke(sessionId: string): Promise<void> {
    await this.config.dispatcher.dispatch({
      name: 'SESSION_REVOKED',
      payload: { sessionId },
      occurredAt: new Date().toISOString(),
    });
  }
}
