export interface RequestContext {
  correlationId: string;
  traceId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  locale?: string;
  path?: string;
  method?: string;
  authUserId?: string;
  authRoles?: string[];
  authPermissions?: string[];
}

export const createRequestContext = (overrides: Partial<RequestContext> = {}): RequestContext => ({
  correlationId: overrides.correlationId ?? crypto.randomUUID(),
  ...overrides,
});
