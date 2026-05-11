import type { LoginRequestDTO } from '../dto/login-request.dto';
import type { LoginResponseDTO } from '../dto/login-response.dto';

export interface AuthProviderPort {
  signInWithCredentials(input: LoginRequestDTO): Promise<LoginResponseDTO>;
}
