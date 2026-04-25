import { z } from 'zod';

const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const userAddressSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  stateCode: z.string(),
  postalCode: z.string(),
  coordinates: coordinatesSchema,
  country: z.string(),
});

const hairSchema = z.object({
  color: z.string(),
  type: z.string(),
});

const bankSchema = z.object({
  cardExpire: z.string(),
  cardNumber: z.string(),
  cardType: z.string(),
  currency: z.string(),
  iban: z.string(),
});

const cryptoSchema = z.object({
  coin: z.string(),
  wallet: z.string(),
  network: z.string(),
});

const companySchema = z.object({
  department: z.string(),
  name: z.string(),
  title: z.string(),
  address: userAddressSchema,
});

export const externalUserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  maidenName: z.string(),
  age: z.number(),
  gender: z.string(),
  email: z.string(),
  phone: z.string(),
  username: z.string(),
  password: z.string(),
  birthDate: z.string(),
  image: z.string(),
  bloodGroup: z.string(),
  height: z.number(),
  weight: z.number(),
  eyeColor: z.string(),
  hair: hairSchema,
  ip: z.string(),
  address: userAddressSchema,
  macAddress: z.string(),
  university: z.string(),
  bank: bankSchema,
  company: companySchema,
  ein: z.string(),
  ssn: z.string(),
  userAgent: z.string(),
  crypto: cryptoSchema,
  role: z.string(),
});

export const getUsersResponseSchema = z.object({
  users: z.array(externalUserSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type ExternalUserDto = z.infer<typeof externalUserSchema>;
export type GetUsersResponseDto = z.infer<typeof getUsersResponseSchema>;
