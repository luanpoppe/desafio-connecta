import type { User as PrismaUser } from '@/generated/prisma/client';
import { PrismaUserMapper } from '../prisma-user.mapper';

describe('PrismaUserMapper', () => {
  it('maps Prisma row to domain User', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const row = {
      id: 1,
      externalId: 99,
      firstName: 'B',
      lastName: 'C',
      maidenName: '',
      age: 20,
      gender: 'x',
      email: 'b@c.dev',
      phone: '1',
      username: 'bc',
      password: 'p',
      birthDate: '2000-01-01',
      image: '',
      bloodGroup: 'O+',
      height: 180,
      weight: 70,
      eyeColor: 'green',
      hair: { color: 'x', type: 'y' },
      ip: '::1',
      address: { city: 'x' },
      macAddress: 'm',
      university: 'u',
      bank: {},
      company: {},
      ein: 'e',
      ssn: 's',
      userAgent: 'ua',
      crypto: {},
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    } as unknown as PrismaUser;

    const user = PrismaUserMapper.toDomain(row);

    expect(user.id).toBe(1);
    expect(user.externalId).toBe(99);
    expect(user.email).toBe('b@c.dev');
    expect(user.createdAt).toEqual(now);
  });
});
