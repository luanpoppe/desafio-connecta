import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { CoreModule } from '@/core/core.module';
import { RedisService } from './cache/redis.service';
import { PrismaService } from './database/prisma.service';
import { ExternalApiService } from './external-api';

@Global()
@Module({
  imports: [HttpModule, CoreModule],
  providers: [ExternalApiService, PrismaService, RedisService],
  exports: [ExternalApiService, PrismaService, RedisService],
})
export class LibModule {}
