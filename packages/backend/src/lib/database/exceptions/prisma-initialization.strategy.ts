import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import type {
  ExceptionHandlerContext,
  HttpExceptionHandlerStrategy,
} from '@/core/http-exception/exception-handler.strategy';
import { ErrorLogFormatter } from '@/utils/error-log-formatter';

export class PrismaInitializationStrategy implements HttpExceptionHandlerStrategy {
  canHandle(exception: unknown): boolean {
    return exception instanceof Prisma.PrismaClientInitializationError;
  }

  handle(exception: unknown, ctx: ExceptionHandlerContext): void {
    const ex = exception as Prisma.PrismaClientInitializationError;
    ErrorLogFormatter.logError(
      ctx.logger,
      'Falha de inicialização do cliente Prisma',
      ex,
    );
    ctx.response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'Serviço de dados indisponível',
    });
  }
}
