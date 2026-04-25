import type { Logger } from '@nestjs/common';
import type { Response } from 'express';

export type ExceptionHandlerContext = {
  readonly response: Response;
  readonly logger: Logger;
};

export interface HttpExceptionHandlerStrategy {
  canHandle(exception: unknown): boolean;
  handle(exception: unknown, ctx: ExceptionHandlerContext): void;
}
