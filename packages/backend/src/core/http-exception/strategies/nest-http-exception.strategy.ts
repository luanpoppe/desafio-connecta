import { HttpException } from '@nestjs/common';
import type {
  ExceptionHandlerContext,
  HttpExceptionHandlerStrategy,
} from '../exception-handler.strategy';

export class NestHttpExceptionStrategy implements HttpExceptionHandlerStrategy {
  canHandle(exception: unknown): boolean {
    return exception instanceof HttpException;
  }

  handle(exception: unknown, ctx: ExceptionHandlerContext): void {
    const ex = exception as HttpException;
    const status = ex.getStatus();
    const body = ex.getResponse();
    ctx.response
      .status(status)
      .json(
        typeof body === 'string'
          ? { statusCode: status, message: body }
          : body,
      );
  }
}
