import { BadRequestException, HttpException } from '@nestjs/common';
import { NestHttpExceptionStrategy } from '../strategies/nest-http-exception.strategy';

describe('NestHttpExceptionStrategy', () => {
  const strategy = new NestHttpExceptionStrategy();

  it('handles HttpException instances', () => {
    expect(strategy.canHandle(new BadRequestException('no'))).toBe(true);
  });

  it('does not handle arbitrary errors', () => {
    expect(strategy.canHandle(new Error('x'))).toBe(false);
  });

  it('writes status and JSON body from HttpException', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const logger = {} as never;
    const ex = new HttpException({ message: 'bad', code: 'X' }, 422);
    strategy.handle(ex, { response: res as never, logger });

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ message: 'bad', code: 'X' });
  });

  it('wraps string response body', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const ex = new HttpException('plain', 400);
    strategy.handle(ex, { response: res as never, logger: {} as never });

    expect(res.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'plain',
    });
  });
});
