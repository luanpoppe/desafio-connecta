import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { EnvService } from './env.service';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';

@Module({
  providers: [
    EnvService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
  exports: [EnvService],
})
export class CoreModule {}
