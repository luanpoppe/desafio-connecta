import type { EnvService } from '@/core/env.service';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaService } from '../prisma.service';

const mockDisconnect = jest.fn().mockResolvedValue(undefined);

jest.mock('@/generated/prisma/client', () => ({
  PrismaClient: class MockPrismaClient {
    $disconnect = mockDisconnect;
    constructor() {}
  },
}));

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockImplementation(() => ({})),
}));

describe('PrismaService', () => {
  const envService = {
    getEnvs: jest.fn().mockReturnValue({
      DATABASE_URL: 'postgresql://localhost:5432/app',
    }),
  } as unknown as EnvService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDisconnect.mockClear();
  });

  it('builds PrismaPg adapter from DATABASE_URL and passes it to PrismaClient', () => {
    new PrismaService(envService);
    expect(PrismaPg).toHaveBeenCalledWith({
      connectionString: 'postgresql://localhost:5432/app',
    });
  });

  it('onModuleDestroy calls $disconnect', async () => {
    const service = new PrismaService(envService);
    await service.onModuleDestroy();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
