import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaKnownRequestStrategy } from '../prisma-known-request.strategy';

function knownRequest(code: string) {
  return new Prisma.PrismaClientKnownRequestError('persist', {
    code,
    clientVersion: '7',
  });
}

describe('PrismaKnownRequestStrategy', () => {
  const strategy = new PrismaKnownRequestStrategy();

  it('handles PrismaClientKnownRequestError', () => {
    expect(strategy.canHandle(knownRequest('P2002'))).toBe(true);
  });

  it('does not handle other errors', () => {
    expect(strategy.canHandle(new Error('x'))).toBe(false);
  });

  it.each([
    ['P2002', HttpStatus.CONFLICT],
    ['P2025', HttpStatus.NOT_FOUND],
    ['P1999', HttpStatus.BAD_REQUEST],
  ] as const)('maps %s to HTTP %s', (code, status) => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    strategy.handle(knownRequest(code), {
      response: res as never,
      logger: {} as never,
    });
    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: status,
      message: 'Erro de persistência',
      code,
    });
  });
});
