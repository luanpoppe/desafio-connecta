import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import type {
  ExceptionHandlerContext,
  HttpExceptionHandlerStrategy,
} from '@/core/http-exception/exception-handler.strategy';

export class PrismaValidationStrategy implements HttpExceptionHandlerStrategy {
  canHandle(exception: unknown): boolean {
    return exception instanceof Prisma.PrismaClientValidationError;
  }

  handle(_exception: unknown, ctx: ExceptionHandlerContext): void {
    ctx.response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Pedido inválido para a base de dados',
    });
  }
}
