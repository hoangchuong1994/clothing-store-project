import type { AuthRepositoryPort } from '../ports/auth.repository';

export interface UnitOfWork {
  authRepository: AuthRepositoryPort;
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export type UnitOfWorkFactory = () => Promise<UnitOfWork>;
