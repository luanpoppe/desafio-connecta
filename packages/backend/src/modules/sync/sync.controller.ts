import { ExternalApiService } from '@/lib/external-api';
import { Controller, HttpCode, Post } from '@nestjs/common';

@Controller()
export class SyncController {
  constructor(private readonly externalApiService: ExternalApiService) {}

  @Post('sync-data')
  @HttpCode(204)
  async syncData() {
    await this.externalApiService.getUsers();
    await this.externalApiService.getCarts();
  }
}
