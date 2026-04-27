import { EnvService } from '@/core/env.service';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import type { Cache } from './cache.interface';

@Injectable()
export class RedisService implements Cache, OnModuleDestroy {
  private readonly client: Redis;

  constructor(private readonly envService: EnvService) {
    const { REDIS_URL } = this.envService.getEnvs();
    this.client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds !== undefined && ttlSeconds > 0) {
      await this.client.set(key, value, 'EX', ttlSeconds);
      return;
    }
    await this.client.set(key, value);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
