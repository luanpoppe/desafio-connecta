import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CoreModule } from '@/core/core.module';
import { ExternalApiService } from './external-api';

@Module({
  imports: [HttpModule, CoreModule],
  providers: [ExternalApiService],
  exports: [ExternalApiService],
})
export class LibModule { }
