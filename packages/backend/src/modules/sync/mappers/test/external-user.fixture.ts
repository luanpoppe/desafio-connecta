import { externalUserSchema } from '@/lib/external-api/dtos/users.dto';
import type { ExternalUserDto } from '@/lib/external-api';

const address = {
  address: 'Rua 1',
  city: 'Lisboa',
  state: 'Lisboa',
  stateCode: '11',
  postalCode: '1000',
  coordinates: { lat: 38.7, lng: -9.1 },
  country: 'PT',
};

/** Utilizador externo mínimo válido para testes (schema Zod). */
export function makeExternalUserDto(overrides: Partial<{ id: number; firstName: string }> = {}): ExternalUserDto {
  return externalUserSchema.parse({
    id: overrides.id ?? 1,
    firstName: overrides.firstName ?? 'Ana',
    lastName: 'Silva',
    maidenName: '',
    age: 30,
    gender: 'female',
    email: 'ana@test.dev',
    phone: '+1000000000',
    username: 'ana',
    password: 'x',
    birthDate: '1994-01-01',
    image: 'https://example.com/a.png',
    bloodGroup: 'A+',
    height: 170,
    weight: 60,
    eyeColor: 'brown',
    hair: { color: 'black', type: 'curly' },
    ip: '127.0.0.1',
    address,
    macAddress: '00:00:00:00:00:01',
    university: 'U',
    bank: {
      cardExpire: '12/30',
      cardNumber: '0000',
      cardType: 'visa',
      currency: 'EUR',
      iban: 'PT00',
    },
    company: {
      department: 'Eng',
      name: 'Co',
      title: 'Dev',
      address,
    },
    ein: 'EIN',
    ssn: 'SSN',
    userAgent: 'jest',
    crypto: { coin: 'BTC', wallet: 'w', network: 'n' },
    role: 'user',
  });
}
