import { PrismaService } from '@/lib/database/prisma.service';
import { ExternalApiService } from '@/lib/external-api';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SyncDataHelper } from '../helpers/sync-data.helper';

@Injectable()
export class SyncUseCase implements OnModuleInit {
  private readonly logger = new Logger(SyncUseCase.name);

  constructor(
    private readonly externalApiService: ExternalApiService,
    private readonly prismaService: PrismaService,
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

  async syncData(): Promise<void> {
    const [usersResponse, cartsResponse] = await Promise.all([
      this.externalApiService.getUsers(),
      this.externalApiService.getCarts(),
    ]);

    await SyncDataHelper.persistExternalUsers(
      this.prismaService,
      usersResponse.users,
    );
    await SyncDataHelper.persistExternalCarts(
      this.prismaService,
      cartsResponse.carts,
    );
  }
}
