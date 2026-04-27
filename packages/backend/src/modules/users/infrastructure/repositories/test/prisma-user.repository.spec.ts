import type { User as PrismaUser } from '@/generated/prisma/client';
import type { PrismaService } from '@/lib/database/prisma.service';
import { PrismaUserRepository } from '../prisma-user.repository';

describe('PrismaUserRepository', () => {
  const findMany = jest.fn();
  const count = jest.fn();
  const findUnique = jest.fn();
  const $transaction = jest.fn();

  const prisma = {
    user: { findMany, count, findUnique },
    $transaction,
  } as unknown as PrismaService;

  const repo = new PrismaUserRepository(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
    $transaction.mockImplementation((ops: Promise<unknown>[]) =>
      Promise.all(ops),
    );
  });

  describe('listAllPaginated', () => {
    const now = new Date('2024-06-01T10:00:00Z');
    const prismaRow = {
      id: 7,
      externalId: 700,
      firstName: 'F',
      lastName: 'L',
      maidenName: '',
      age: 25,
      gender: 'x',
      email: 'f@x.dev',
      phone: '1',
      username: 'fl',
      password: 'p',
      birthDate: '1999-01-01',
      image: '',
      bloodGroup: 'A+',
      height: 170,
      weight: 60,
      eyeColor: 'brown',
      hair: { color: 'black', type: 'curly' },
      ip: '127.0.0.1',
      address: { city: 'Lisboa' },
      macAddress: 'm',
      university: 'u',
      bank: {},
      company: {},
      ein: 'e',
      ssn: 's',
      userAgent: 'ua',
      crypto: {},
      role: 'user',
      createdAt: now,
      updatedAt: now,
    } as unknown as PrismaUser;

    it('returns mapped items, total, and normalized page and pageSize', async () => {
      findMany.mockResolvedValue([prismaRow]);
      count.mockResolvedValue(42);

      const result = await repo.listAllPaginated({ page: 2, pageSize: 10 });

      expect(findMany).toHaveBeenCalledWith({
        skip: 10,
        take: 10,
        orderBy: { id: 'asc' },
      });
      expect(count).toHaveBeenCalledWith();
      expect(result).toEqual({
        items: [
          expect.objectContaining({
            id: 7,
            externalId: 700,
            email: 'f@x.dev',
            createdAt: now,
          }),
        ],
        totalItems: 42,
        page: 2,
        pageSize: 10,
      });
    });

    it('clamps page and pageSize to at least 1', async () => {
      findMany.mockResolvedValue([]);
      count.mockResolvedValue(0);

      await repo.listAllPaginated({ page: 0, pageSize: -3 });

      expect(findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 1,
        orderBy: { id: 'asc' },
      });
    });
  });

  describe('findExternalIdByInternalUserId', () => {
    it('returns externalId when the user exists', async () => {
      findUnique.mockResolvedValue({ externalId: 999 });

      await expect(
        repo.findExternalIdByInternalUserId(5),
      ).resolves.toBe(999);

      expect(findUnique).toHaveBeenCalledWith({
        where: { id: 5 },
        select: { externalId: true },
      });
    });

    it('returns null when the user is missing', async () => {
      findUnique.mockResolvedValue(null);

      await expect(
        repo.findExternalIdByInternalUserId(99),
      ).resolves.toBeNull();
    });

    it('returns null when externalId is absent on the row', async () => {
      findUnique.mockResolvedValue({});

      await expect(
        repo.findExternalIdByInternalUserId(1),
      ).resolves.toBeNull();
    });
  });
});
