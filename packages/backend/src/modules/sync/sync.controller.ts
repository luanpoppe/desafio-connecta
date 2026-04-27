import { Controller, HttpCode, Post } from '@nestjs/common';
import { SyncUseCase } from './use-cases/sync.use-case';

@Controller()
export class SyncController {
  constructor(private readonly syncUseCase: SyncUseCase) {}

  @Post('sync-data')
  @HttpCode(204)
  async syncData() {
    await this.syncUseCase.syncData({ force: true });
  }
}
