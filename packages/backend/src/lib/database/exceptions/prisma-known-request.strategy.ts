import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import type {
  ExceptionHandlerContext,
  HttpExceptionHandlerStrategy,
} from '@/core/http-exception/exception-handler.strategy';

export class PrismaKnownRequestStrategy implements HttpExceptionHandlerStrategy {
  canHandle(exception: unknown): boolean {
    return exception instanceof Prisma.PrismaClientKnownRequestError;
  }

  handle(exception: unknown, ctx: ExceptionHandlerContext): void {
    const ex = exception as Prisma.PrismaClientKnownRequestError;
    const status = this.mapKnownRequestToHttpStatus(ex.code);
    ctx.response.status(status).json({
      statusCode: status,
      message: 'Erro de persistência',
      code: ex.code,
    });
  }

  private mapKnownRequestToHttpStatus(code: string): HttpStatus {
    switch (code) {
      case 'P2002':
        return HttpStatus.CONFLICT;
      case 'P2025':
        return HttpStatus.NOT_FOUND;
      default:
        return HttpStatus.BAD_REQUEST;
    }
  }
}
