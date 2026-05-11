import type { SessionDTO, UserDTO } from '../../shared/contracts/auth.types';

export function mapNextAuthUserToDTO(user: Partial<UserDTO>): UserDTO {
  return {
    id: user.id ?? '',
    email: user.email ?? '',
    name: user.name ?? '',
    role: user.role ?? 'CUSTOMER',
    permissions: user.permissions ?? [],
    status: user.status ?? 'PENDING_EMAIL_VERIFICATION',
    createdAt: user.createdAt ?? new Date().toISOString(),
    updatedAt: user.updatedAt ?? new Date().toISOString(),
  };
}

export function mapNextAuthSessionToDTO(session: Partial<SessionDTO>): SessionDTO {
  return {
    id: session.id ?? '',
    userId: session.userId ?? '',
    sessionToken: session.sessionToken ?? '',
    createdAt: session.createdAt ?? new Date().toISOString(),
    updatedAt: session.updatedAt ?? new Date().toISOString(),
    expiresAt: session.expiresAt ?? new Date().toISOString(),
  };
}

export const nextAuthAntiCorruptionLayer = {
  mapUser: mapNextAuthUserToDTO,
  mapSession: mapNextAuthSessionToDTO,
};
