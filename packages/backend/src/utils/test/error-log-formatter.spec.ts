import type { Logger } from '@nestjs/common';
import { ErrorLogFormatter } from '../error-log-formatter';

describe('ErrorLogFormatter', () => {
  it('logs Error with stack', () => {
    const errorSpy = jest.fn();
    const logger = { error: errorSpy } as unknown as Logger;
    const err = new Error('boom');
    ErrorLogFormatter.logError(logger, 'ctx', err);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('ctx — boom'),
      err.stack,
    );
  });

  it('logs non-Error as string', () => {
    const errorSpy = jest.fn();
    const logger = { error: errorSpy } as unknown as Logger;
    ErrorLogFormatter.logError(logger, 'ctx', 503);
    expect(errorSpy).toHaveBeenCalledWith('ctx — 503');
  });
});
