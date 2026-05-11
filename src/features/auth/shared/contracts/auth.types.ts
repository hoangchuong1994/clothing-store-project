export type AuthRoleCode = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'SELLER' | 'CUSTOMER';
export type AuthPermissionCode =
  | 'MANAGE_USERS'
  | 'VIEW_ORDERS'
  | 'MANAGE_PRODUCTS'
  | 'PROCESS_ORDERS'
  | 'MANAGE_STORE'
  | 'MANAGE_SELF_PROFILE'
  | 'VIEW_CART'
  | 'CHECKOUT';

export type UserStatus = 'ACTIVE' | 'PENDING_EMAIL_VERIFICATION' | 'SUSPENDED' | 'DEACTIVATED';

export interface CreateUserDTO {
  name: string;
  email: string;
  passwordHash: string;
  role: AuthRoleCode;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: AuthRoleCode;
  permissions: AuthPermissionCode[];
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithCredentialsDTO extends UserDTO {
  passwordHash: string;
}

export interface SessionDTO {
  id: string;
  userId: string;
  sessionToken: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface VerificationTokenDTO {
  id: string;
  userId: string;
  hashedToken: string;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}

export interface AuthCommandResult<T = void> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
