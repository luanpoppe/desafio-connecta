import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { ErrorLogFormatter } from '@/utils/error-log-formatter';
import { PrismaInitializationStrategy } from '../prisma-initialization.strategy';

jest.mock('@/utils/error-log-formatter', () => ({
  ErrorLogFormatter: {
    logError: jest.fn(),
  },
}));

describe('PrismaInitializationStrategy', () => {
  const strategy = new PrismaInitializationStrategy();

  it('handles PrismaClientInitializationError', () => {
    const ex = new Prisma.PrismaClientInitializationError('db down', '7');
    expect(strategy.canHandle(ex)).toBe(true);
  });

  it('does not handle other errors', () => {
    expect(strategy.canHandle(new Error('x'))).toBe(false);
  });

  it('responds 503 and logs via ErrorLogFormatter', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const logger = { error: jest.fn() } as never;
    const ex = new Prisma.PrismaClientInitializationError('init', '7');
    strategy.handle(ex, { response: res as never, logger });

    const logErrorMock = ErrorLogFormatter as unknown as {
      logError: jest.Mock;
    };
    expect(logErrorMock.logError).toHaveBeenCalledWith(
      logger,
      'Falha de inicialização do cliente Prisma',
      ex,
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'Serviço de dados indisponível',
    });
  });
});
