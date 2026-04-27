/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaService } from '@/lib/database/prisma.service';
import { SyncDataHelper } from '../sync-data.helper';
import { makeExternalUserDto } from '../../mappers/test/external-user.fixture';

describe('SyncDataHelper', () => {
  it('persists users in batches via upsert', async () => {
    const upsert = jest.fn().mockResolvedValue(undefined);
    const prisma = {
      user: { upsert },
    } as unknown as PrismaService;

    const users = [
      makeExternalUserDto({ id: 1, firstName: 'A' }),
      makeExternalUserDto({ id: 2, firstName: 'B' }),
      makeExternalUserDto({ id: 3, firstName: 'C' }),
    ];

    await SyncDataHelper.persistExternalUsers(prisma, users);

    expect(upsert).toHaveBeenCalledTimes(3);
    expect(upsert).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { externalId: 1 },
        create: expect.objectContaining({ externalId: 1, firstName: 'A' }),
        update: expect.objectContaining({ firstName: 'A' }),
      }),
    );
  });
});
