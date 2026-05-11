export interface FeatureFlagStore {
  isEnabled(flag: string, context?: Record<string, unknown>): Promise<boolean>;
}

export class FeatureFlagService {
  constructor(private readonly store: FeatureFlagStore) {}

  public async isEnabled(flag: string, context: Record<string, unknown> = {}): Promise<boolean> {
    return this.store.isEnabled(flag, context);
  }
}
