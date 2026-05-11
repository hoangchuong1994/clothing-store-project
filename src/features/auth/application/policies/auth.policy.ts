import type { AuthPermissionCode } from '../../shared/contracts/auth.types';

export interface PolicyContext {
  userId: string;
  roles: string[];
  permissions: AuthPermissionCode[];
  resourceOwnerId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthPolicyEvaluator {
  canPerform(permission: AuthPermissionCode, context: PolicyContext): boolean;
  canAccessResource(resourceOwnerId: string, context: PolicyContext): boolean;
}

export class AuthPolicy implements AuthPolicyEvaluator {
  public canPerform(permission: AuthPermissionCode, context: PolicyContext): boolean {
    return context.permissions.includes(permission);
  }

  public canAccessResource(resourceOwnerId: string, context: PolicyContext): boolean {
    const isOwner = resourceOwnerId === context.userId;
    return isOwner || context.permissions.includes('MANAGE_USERS');
  }
}
