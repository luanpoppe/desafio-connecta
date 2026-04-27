import type { PrismaService } from '@/lib/database/prisma.service';
import type { ExternalApiService } from '@/lib/external-api';
import type { Cache } from '@/lib/cache/cache.interface';
import { Logger } from '@nestjs/common';
import { makeExternalUserDto } from '../../mappers/test/external-user.fixture';
import { SyncUseCase } from '../sync.use-case';

describe('SyncUseCase', () => {
  const getUsers = jest.fn();
  const upsert = jest.fn().mockResolvedValue(undefined);
  const externalApiService = {
    getUsers,
  } as unknown as ExternalApiService;

  const prismaService = {
    user: { upsert },
  } as unknown as PrismaService;

  const redisGet = jest.fn();
  const redisSet = jest.fn().mockResolvedValue(undefined);
  const redisDel = jest.fn().mockResolvedValue(undefined);
  const redisService = {
    get: redisGet,
    set: redisSet,
    del: redisDel,
  } as unknown as Cache;

  beforeEach(() => {
    jest.clearAllMocks();
    upsert.mockResolvedValue(undefined);
    redisGet.mockResolvedValue(null);
  });

  const createUseCase = () =>
    new SyncUseCase(externalApiService, prismaService, redisService);

  describe('syncData', () => {
    it('fetches users from the external API and upserts each in Prisma', async () => {
      const u1 = makeExternalUserDto({ id: 10, firstName: 'A' });
      const u2 = makeExternalUserDto({ id: 11, firstName: 'B' });
      getUsers.mockResolvedValue({ users: [u1, u2] });

      await createUseCase().syncData();

      expect(getUsers).toHaveBeenCalledTimes(1);
      expect(upsert).toHaveBeenCalledTimes(2);
      expect(upsert).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          where: { externalId: 10 },
          create: expect.objectContaining({ externalId: 10 }),
          update: expect.any(Object),
        }),
      );
    });

    it('persists every user when the API returns many', async () => {
      const users = Array.from({ length: 6 }, (_, i) =>
        makeExternalUserDto({ id: 100 + i, firstName: `U${i}` }),
      );
      getUsers.mockResolvedValue({ users });

      await createUseCase().syncData();

      expect(upsert).toHaveBeenCalledTimes(6);
      expect(upsert).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ where: { externalId: 100 } }),
      );
    });

    it('does nothing in Prisma when the external API returns no users', async () => {
      getUsers.mockResolvedValue({ users: [] });

      await createUseCase().syncData();

      expect(upsert).not.toHaveBeenCalled();
    });

    it('when force is true, runs API and upsert even if Redis has cached users', async () => {
      const cached = makeExternalUserDto({ id: 99, firstName: 'Stale' });
      const fresh = makeExternalUserDto({ id: 1, firstName: 'Fresh' });
      redisGet.mockResolvedValue(JSON.stringify([cached]));
      getUsers.mockResolvedValue({ users: [fresh] });

      await createUseCase().syncData({ force: true });

      expect(redisGet).not.toHaveBeenCalled();
      expect(getUsers).toHaveBeenCalledTimes(1);
      expect(upsert).toHaveBeenCalledTimes(1);
    });
  });

  describe('onModuleInit', () => {
    let logSpy: jest.SpyInstance;
    let errorSpy: jest.SpyInstance;

    beforeAll(() => {
      logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
      errorSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation(() => {});
    });

    afterAll(() => {
      logSpy.mockRestore();
      errorSpy.mockRestore();
    });

    beforeEach(() => {
      logSpy.mockClear();
      errorSpy.mockClear();
    });

    it('logs success when syncData completes', async () => {
      getUsers.mockResolvedValue({ users: [] });

      const useCase = createUseCase();
      useCase.onModuleInit();

      await new Promise<void>((resolve) => {
        setImmediate(() => resolve());
      });

      expect(logSpy).toHaveBeenCalledWith(
        '✅ Sincronização inicial concluída.',
      );
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it('logs error when syncData rejects', async () => {
      getUsers.mockRejectedValue(new Error('api down'));

      const useCase = createUseCase();
      useCase.onModuleInit();

      await new Promise<void>((resolve) => {
        setImmediate(() => resolve());
      });

      expect(errorSpy).toHaveBeenCalledWith(
        '❌ Sincronização inicial falhou.',
        expect.any(String),
      );
      expect(logSpy).not.toHaveBeenCalledWith(
        '✅ Sincronização inicial concluída.',
      );
    });
  });
});
