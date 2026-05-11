export interface PasswordHasherPort {
  compare(plainText: string, hashedValue: string): Promise<boolean>;
}
