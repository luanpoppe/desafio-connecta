import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncUseCase } from './use-cases/sync.use-case';

@Module({
  controllers: [SyncController],
  providers: [SyncUseCase],
})
export class SyncModule {}
