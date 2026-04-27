import { RedisService } from '@/lib/cache/redis.service';
import { PrismaService } from '@/lib/database/prisma.service';
import { ExternalApiService } from '@/lib/external-api';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SyncDataHelper } from '../helpers/sync-data.helper';
import { SyncUsersRedisHelper } from '../helpers/sync-users-redis.helper';

export type SyncDataOptions = {
  force?: boolean;
};

@Injectable()
export class SyncUseCase implements OnModuleInit {
  private readonly logger = new Logger(SyncUseCase.name);

  constructor(
    private readonly externalApiService: ExternalApiService,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  onModuleInit(): void {
    void this.syncData()
      .then(() => this.logger.log('✅ Sincronização inicial concluída.'))
      .catch((err: unknown) => {
        this.logger.error(
          '❌ Sincronização inicial falhou.',
          err instanceof Error ? err.stack : err,
        );
      });
  }

  async syncData(options?: SyncDataOptions): Promise<void> {
    const force = options?.force === true;

    if (!force) {
      const skip = await SyncUsersRedisHelper.trySkipStartupSyncUsingCache(
        this.redisService,
        this.logger,
      );

      if (skip) {
        return;
      }
    }

    const usersResponse = await this.externalApiService.getUsers();

    await SyncDataHelper.persistExternalUsers(
      this.prismaService,
      usersResponse.users,
    );

    await SyncUsersRedisHelper.writeUsersCache(
      this.redisService,
      this.logger,
      usersResponse.users,
    );
  }
}
