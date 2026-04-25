import { LibModule } from '@/lib/lib.module';
import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';

@Module({
  imports: [LibModule],
  controllers: [SyncController],
})
export class SyncModule { }
