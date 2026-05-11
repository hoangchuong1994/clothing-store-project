export type AuthEventName =
  | 'USER_REGISTERED'
  | 'EMAIL_VERIFIED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'SESSION_CREATED'
  | 'SESSION_REVOKED'
  | 'SUSPICIOUS_LOGIN_DETECTED'
  | 'TOKEN_ROTATED';

export interface AuthEvent<TPayload = Record<string, unknown>> {
  name: AuthEventName;
  payload: TPayload;
  occurredAt: string;
  source?: string;
  correlationId?: string;
}

export interface AuthEventDispatcher {
  dispatch<TPayload>(event: AuthEvent<TPayload>): Promise<void>;
}
