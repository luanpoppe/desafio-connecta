import { EnvService } from '@/core/env.service';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(private readonly envService: EnvService) {
    const connectionString = envService.getEnvs().DATABASE_URL;
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
