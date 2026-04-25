import type { Logger } from '@nestjs/common';

export class ErrorLogFormatter {
  static logError(logger: Logger, message: string, err: unknown): void {
    if (err instanceof Error) {
      logger.error(`${message} — ${err.message}`, err.stack);
      return;
    }
    logger.error(`${message} — ${String(err)}`);
  }
}
