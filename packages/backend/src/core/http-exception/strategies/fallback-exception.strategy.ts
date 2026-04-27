import { HttpStatus } from '@nestjs/common';
import { ErrorLogFormatter } from '@/utils/error-log-formatter';
import type {
  ExceptionHandlerContext,
  HttpExceptionHandlerStrategy,
} from '../exception-handler.strategy';

export class FallbackExceptionStrategy implements HttpExceptionHandlerStrategy {
  canHandle(_exception: unknown): boolean {
    void _exception;
    return true;
  }

  handle(exception: unknown, ctx: ExceptionHandlerContext): void {
    ErrorLogFormatter.logError(
      ctx.logger,
      'Exceção não tratada pelo filtro HTTP',
      exception,
    );
    ctx.response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
    });
  }
}
