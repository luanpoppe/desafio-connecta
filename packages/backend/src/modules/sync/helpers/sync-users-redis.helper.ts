import type { Cache } from '@/lib/cache/cache.interface';
import {
  externalUserSchema,
  type ExternalUserDto,
} from '@/lib/external-api/dtos';
import { Logger } from '@nestjs/common';
import { z } from 'zod';

const cachedUsersListSchema = z.array(externalUserSchema);

export class SyncUsersRedisHelper {
  static readonly REDIS_KEY = 'sync:external-users';
  static readonly TTL_SECONDS = 3600;

  static async trySkipStartupSyncUsingCache(
    redis: Cache,
    logger: Logger,
  ): Promise<boolean> {
    try {
      const raw = await redis.get(SyncUsersRedisHelper.REDIS_KEY);
      if (raw === null) {
        return false;
      }

      const json: unknown = JSON.parse(raw);
      const parsed = cachedUsersListSchema.safeParse(json);
      if (!parsed.success) {
        await redis.del(SyncUsersRedisHelper.REDIS_KEY);
        return false;
      }

      logger.log(
        'Sincronização inicial ignorada: usuários ainda em cache no Redis (TTL 1h).',
      );
      return true;
    } catch (err: unknown) {
      logger.warn(
        'Falha ao ler cache Redis da sync; prosseguindo com upsert.',
        err instanceof Error ? err.message : err,
      );
      try {
        await redis.del(SyncUsersRedisHelper.REDIS_KEY);
      } catch {
        /* ignore */
      }
      return false;
    }
  }

  static async writeUsersCache(
    redis: Cache,
    logger: Logger,
    users: ExternalUserDto[],
  ): Promise<void> {
    try {
      await redis.set(
        SyncUsersRedisHelper.REDIS_KEY,
        JSON.stringify(users),
        SyncUsersRedisHelper.TTL_SECONDS,
      );
    } catch (err: unknown) {
      logger.warn(
        'Não foi possível gravar usuários da sync no Redis.',
        err instanceof Error ? err.message : err,
      );
    }
  }
}
