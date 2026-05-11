import type { UserWithCredentialsDTO } from '../../shared/contracts/auth.types';

export interface UserRepositoryPort {
  findByEmail(email: string): Promise<UserWithCredentialsDTO | null>;
}
