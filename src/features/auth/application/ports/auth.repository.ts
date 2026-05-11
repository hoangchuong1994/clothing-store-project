import type {
  CreateUserDTO,
  SessionDTO,
  UserDTO,
  VerificationTokenDTO,
} from '../../shared/contracts/auth.types';

export interface AuthRepositoryPort {
  createUser(payload: CreateUserDTO): Promise<UserDTO>;
  findUserByEmail(email: string): Promise<UserDTO | null>;
  findUserById(id: string): Promise<UserDTO | null>;
  persistVerificationToken(token: VerificationTokenDTO): Promise<void>;
  findVerificationToken(rawToken: string): Promise<VerificationTokenDTO | null>;
  markVerificationTokenUsed(tokenId: string): Promise<void>;
  createSession(session: SessionDTO): Promise<SessionDTO>;
  revokeSession(sessionId: string): Promise<void>;
  listActiveSessions(userId: string): Promise<SessionDTO[]>;
  revokeSessionsByUser(userId: string, options?: { excludeSessionId?: string }): Promise<number>;
}
