export const AuthMetricNames = {
  AUTH_LOGIN_ATTEMPT: 'auth.login_attempt',
  AUTH_REGISTRATION_ATTEMPT: 'auth.registration_attempt',
  AUTH_VERIFICATION_SENT: 'auth.verification_sent',
  AUTH_PASSWORD_RESET: 'auth.password_reset',
  AUTH_SESSION_CREATED: 'auth.session_created',
  AUTH_SESSION_REVOKED: 'auth.session_revoked',
  AUTH_SUSPICIOUS_LOGIN: 'auth.suspicious_login',
} as const;

export type AuthMetricName = (typeof AuthMetricNames)[keyof typeof AuthMetricNames];

export interface AuthMetricsService {
  increment(metric: AuthMetricName, value?: number): Promise<void>;
  gauge(metric: AuthMetricName, value: number): Promise<void>;
  timing(metric: AuthMetricName, durationMs: number): Promise<void>;
}

export class NoopAuthMetricsService implements AuthMetricsService {
  async increment(): Promise<void> {
    return;
  }

  async gauge(): Promise<void> {
    return;
  }

  async timing(): Promise<void> {
    return;
  }
}
