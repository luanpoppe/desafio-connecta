import {
  type ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import {
  PrismaInitializationStrategy,
  PrismaKnownRequestStrategy,
  PrismaValidationStrategy,
} from '@/lib/database/exceptions';
import type { Response } from 'express';
import type {
  ExceptionHandlerContext,
  HttpExceptionHandlerStrategy,
} from './exception-handler.strategy';
import {
  FallbackExceptionStrategy,
  NestHttpExceptionStrategy,
} from './strategies';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  private readonly strategies: readonly HttpExceptionHandlerStrategy[];

  constructor() {
    this.strategies = [
      new NestHttpExceptionStrategy(),
      new PrismaKnownRequestStrategy(),
      new PrismaValidationStrategy(),
      new PrismaInitializationStrategy(),
      new FallbackExceptionStrategy(),
    ];
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const ctx: ExceptionHandlerContext = {
      response,
      logger: this.logger,
    };

    for (const strategy of this.strategies) {
      if (strategy.canHandle(exception)) {
        strategy.handle(exception, ctx);
        return;
      }
    }
  }
}
