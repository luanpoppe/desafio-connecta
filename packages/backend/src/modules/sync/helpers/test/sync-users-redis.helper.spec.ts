import type { RedisService } from '@/lib/cache/redis.service';
import { Logger } from '@nestjs/common';
import { makeExternalUserDto } from '../../mappers/test/external-user.fixture';
import { SyncUsersRedisHelper } from '../sync-users-redis.helper';

describe('SyncUsersRedisHelper', () => {
  const redisGet = jest.fn();
  const redisSet = jest.fn().mockResolvedValue(undefined);
  const redisDel = jest.fn().mockResolvedValue(undefined);
  const redis = {
    get: redisGet,
    set: redisSet,
    del: redisDel,
  } as unknown as RedisService;

  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeAll(() => {
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    redisGet.mockResolvedValue(null);
  });

  const logger = new Logger('Test');

  describe('trySkipStartupSyncUsingCache', () => {
    it('returns false when Redis has no value', async () => {
      redisGet.mockResolvedValue(null);

      const skip = await SyncUsersRedisHelper.trySkipStartupSyncUsingCache(
        redis,
        logger,
      );

      expect(skip).toBe(false);
      expect(redisGet).toHaveBeenCalledWith(SyncUsersRedisHelper.REDIS_KEY);
      expect(logSpy).not.toHaveBeenCalledWith(
        'Sincronização inicial ignorada: usuários ainda em cache no Redis (TTL 1h).',
      );
    });

    it('returns true and logs when Redis holds a valid users JSON array', async () => {
      const u1 = makeExternalUserDto({ id: 1, firstName: 'Cached' });
      redisGet.mockResolvedValue(JSON.stringify([u1]));

      const skip = await SyncUsersRedisHelper.trySkipStartupSyncUsingCache(
        redis,
        logger,
      );

      expect(skip).toBe(true);
      expect(redisDel).not.toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(
        'Sincronização inicial ignorada: usuários ainda em cache no Redis (TTL 1h).',
      );
    });

    it('returns true for an empty users array in cache', async () => {
      redisGet.mockResolvedValue('[]');

      const skip = await SyncUsersRedisHelper.trySkipStartupSyncUsingCache(
        redis,
        logger,
      );

      expect(skip).toBe(true);
    });

    it('deletes key and returns false when JSON is not a valid user array', async () => {
      redisGet.mockResolvedValue(JSON.stringify({ not: 'array' }));

      const skip = await SyncUsersRedisHelper.trySkipStartupSyncUsingCache(
        redis,
        logger,
      );

      expect(skip).toBe(false);
      expect(redisDel).toHaveBeenCalledWith(SyncUsersRedisHelper.REDIS_KEY);
    });

    it('warns, deletes key, and returns false when JSON.parse fails', async () => {
      redisGet.mockResolvedValue('not-json{');

      const skip = await SyncUsersRedisHelper.trySkipStartupSyncUsingCache(
        redis,
        logger,
      );

      expect(skip).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        'Falha ao ler cache Redis da sync; prosseguindo com upsert.',
        expect.any(String),
      );
      expect(redisDel).toHaveBeenCalledWith(SyncUsersRedisHelper.REDIS_KEY);
    });
  });

  describe('writeUsersCache', () => {
    it('writes serialized users with TTL', async () => {
      const u1 = makeExternalUserDto({ id: 10, firstName: 'A' });
      const u2 = makeExternalUserDto({ id: 11, firstName: 'B' });

      await SyncUsersRedisHelper.writeUsersCache(redis, logger, [u1, u2]);

      expect(redisSet).toHaveBeenCalledWith(
        SyncUsersRedisHelper.REDIS_KEY,
        JSON.stringify([u1, u2]),
        SyncUsersRedisHelper.TTL_SECONDS,
      );
    });

    it('logs a warning when Redis set fails', async () => {
      redisSet.mockRejectedValueOnce(new Error('redis down'));
      const u1 = makeExternalUserDto({ id: 1 });

      await SyncUsersRedisHelper.writeUsersCache(redis, logger, [u1]);

      expect(warnSpy).toHaveBeenCalledWith(
        'Não foi possível gravar usuários da sync no Redis.',
        'redis down',
      );
    });
  });
});
