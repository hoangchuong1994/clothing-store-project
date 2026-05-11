export class PasswordHash {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.length < 60) {
      throw new Error('Invalid password hash');
    }

    this.value = value;
  }

  public toString(): string {
    return this.value;
  }
}
