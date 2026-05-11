export interface SecurityContext {
  userId?: string;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  hasTwoFactorEnabled: boolean;
  riskScore?: number;
  deviceId?: string;
}

export const createSecurityContext = (options: Partial<SecurityContext> = {}): SecurityContext => ({
  roles: [],
  permissions: [],
  isAuthenticated: false,
  isEmailVerified: false,
  hasTwoFactorEnabled: false,
  ...options,
});
