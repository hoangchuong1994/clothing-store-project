export interface CacheClient {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  incr(key: string, ttlSeconds?: number): Promise<number>;
}

export class CacheService implements CacheClient {
  constructor(private readonly client: CacheClient) {}

  public async get<T>(key: string): Promise<T | null> {
    return this.client.get<T>(key);
  }

  public async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.client.set<T>(key, value, ttlSeconds);
  }

  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async incr(key: string, ttlSeconds?: number): Promise<number> {
    return this.client.incr(key, ttlSeconds);
  }
}
