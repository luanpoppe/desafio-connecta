import type { EnvService } from '@/core/env.service';
import Redis from 'ioredis';
import { RedisService } from '../redis.service';

let redisMockInstance: {
  get: jest.Mock;
  set: jest.Mock;
  del: jest.Mock;
  quit: jest.Mock;
};

jest.mock('ioredis', () =>
  jest.fn().mockImplementation(() => {
    redisMockInstance = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
      quit: jest.fn().mockResolvedValue('OK'),
    };
    return redisMockInstance;
  }),
);

describe('RedisService', () => {
  const envService = {
    getEnvs: jest.fn().mockReturnValue({ REDIS_URL: 'redis://localhost:6379/0' }),
  } as unknown as EnvService;

  beforeEach(() => {
    jest.clearAllMocks();
    envService.getEnvs = jest
      .fn()
      .mockReturnValue({ REDIS_URL: 'redis://localhost:6379/0' });
  });

  it('constructs ioredis client with URL and retry options', () => {
    new RedisService(envService);
    expect(Redis).toHaveBeenCalledWith('redis://localhost:6379/0', {
      maxRetriesPerRequest: 3,
    });
  });

  it('get delegates to client.get', async () => {
    const service = new RedisService(envService);
    redisMockInstance.get.mockResolvedValueOnce('cached');
    await expect(service.get('k')).resolves.toBe('cached');
    expect(redisMockInstance.get).toHaveBeenCalledWith('k');
  });

  it('set without ttl uses plain SET', async () => {
    const service = new RedisService(envService);
    await service.set('k', 'v');
    expect(redisMockInstance.set).toHaveBeenCalledWith('k', 'v');
  });

  it('set with positive ttl uses SET EX', async () => {
    const service = new RedisService(envService);
    await service.set('k', 'v', 60);
    expect(redisMockInstance.set).toHaveBeenCalledWith('k', 'v', 'EX', 60);
  });

  it('set ignores ttl when zero or negative', async () => {
    const service = new RedisService(envService);
    await service.set('k', 'v', 0);
    await service.set('k', 'v', -1);
    expect(redisMockInstance.set).toHaveBeenNthCalledWith(1, 'k', 'v');
    expect(redisMockInstance.set).toHaveBeenNthCalledWith(2, 'k', 'v');
  });

  it('del delegates to client.del', async () => {
    const service = new RedisService(envService);
    await service.del('k');
    expect(redisMockInstance.del).toHaveBeenCalledWith('k');
  });

  it('onModuleDestroy quits the client', async () => {
    const service = new RedisService(envService);
    await service.onModuleDestroy();
    expect(redisMockInstance.quit).toHaveBeenCalled();
  });
});
