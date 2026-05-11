import { comparePasswords } from '../security/hash';
import type { PasswordHasherPort } from '../../application/ports/password-hasher.port';

export class BcryptPasswordHasherAdapter implements PasswordHasherPort {
  public async compare(plainText: string, hashedValue: string): Promise<boolean> {
    return comparePasswords(plainText, hashedValue);
  }
}
