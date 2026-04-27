import { HttpStatus } from '@nestjs/common';
import { FallbackExceptionStrategy } from '../strategies/fallback-exception.strategy';

describe('FallbackExceptionStrategy', () => {
  const strategy = new FallbackExceptionStrategy();

  it('always canHandle', () => {
    expect(strategy.canHandle(null)).toBe(true);
    expect(strategy.canHandle(new Error())).toBe(true);
  });

  it('responds 500 and logs', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const logger = { error: jest.fn() };
    strategy.handle(new Error('fail'), {
      response: res as never,
      logger: logger as never,
    });

    expect(logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
    });
  });
});
