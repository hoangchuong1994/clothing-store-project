export class EmailAddress {
  public readonly value: string;

  constructor(value: string) {
    const normalized = value.trim().toLowerCase();

    if (!normalized || !normalized.includes('@')) {
      throw new Error('Invalid email address');
    }

    this.value = normalized;
  }

  public toString(): string {
    return this.value;
  }
}
