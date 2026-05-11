import type { SessionDTO } from '../../shared/contracts/auth.types';

export interface SessionRepositoryPort {
  createSession(session: Omit<SessionDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<SessionDTO>;
}
