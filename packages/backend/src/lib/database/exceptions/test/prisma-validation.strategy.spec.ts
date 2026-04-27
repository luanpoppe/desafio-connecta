import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaValidationStrategy } from '../prisma-validation.strategy';

describe('PrismaValidationStrategy', () => {
  const strategy = new PrismaValidationStrategy();

  it('handles PrismaClientValidationError', () => {
    const ex = new Prisma.PrismaClientValidationError('invalid', {
      clientVersion: '7',
    });
    expect(strategy.canHandle(ex)).toBe(true);
  });

  it('does not handle other errors', () => {
    expect(strategy.canHandle(new Error('x'))).toBe(false);
  });

  it('responds 400 with stable message', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const ex = new Prisma.PrismaClientValidationError('bad', {
      clientVersion: '7',
    });
    strategy.handle(ex, { response: res as never, logger: {} as never });

    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Pedido inválido para a base de dados',
    });
  });
});
