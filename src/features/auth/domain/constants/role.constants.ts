export const ROLE_CODES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  SELLER: 'SELLER',
  CUSTOMER: 'CUSTOMER',
} as const;

export type RoleCode = (typeof ROLE_CODES)[keyof typeof ROLE_CODES];

export const ROLE_LABELS: Record<RoleCode, string> = {
  SUPER_ADMIN: 'Super Administrator',
  ADMIN: 'Administrator',
  STAFF: 'Staff',
  SELLER: 'Seller',
  CUSTOMER: 'Customer',
};

export const DEFAULT_ROLE: RoleCode = ROLE_CODES.CUSTOMER;
