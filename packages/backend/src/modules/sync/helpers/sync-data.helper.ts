import { PrismaService } from '@/lib/database/prisma.service';
import type { ExternalUserDto } from '@/lib/external-api';
import { ExternalUserToPrismaMapper } from '../mappers/user.mapper';

export class SyncDataHelper {
  static readonly USER_UPSERT_BATCH_SIZE = 5;

  static async persistExternalUsers(
    prisma: PrismaService,
    users: ExternalUserDto[],
  ): Promise<void> {
    for (
      let i = 0;
      i < users.length;
      i += SyncDataHelper.USER_UPSERT_BATCH_SIZE
    ) {
      const batch = users.slice(i, i + SyncDataHelper.USER_UPSERT_BATCH_SIZE);

      const promises = batch.map((externalUser) => {
        const fields = ExternalUserToPrismaMapper.map(externalUser);
        return prisma.user.upsert({
          where: { externalId: externalUser.id },
          create: { externalId: externalUser.id, ...fields },
          update: fields,
        });
      });

      await Promise.all(promises);
    }
  }
}
