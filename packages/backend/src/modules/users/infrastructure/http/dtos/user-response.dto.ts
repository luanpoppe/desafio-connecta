import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import type { User } from '../../../domain/entities/user.entity';

export const userResponseSchema = z.object({
  id: z.number().int(),
  externalId: z.number().int(),
  firstName: z.string(),
  lastName: z.string(),
  maidenName: z.string(),
  age: z.number().int(),
  gender: z.string(),
  email: z.string(),
  phone: z.string(),
  username: z.string(),
  birthDate: z.string(),
  image: z.string(),
  bloodGroup: z.string(),
  height: z.number(),
  weight: z.number(),
  eyeColor: z.string(),
  hair: z.unknown(),
  ip: z.string(),
  address: z.unknown(),
  macAddress: z.string(),
  university: z.string(),
  bank: z.unknown(),
  company: z.unknown(),
  ein: z.string(),
  ssn: z.string(),
  userAgent: z.string(),
  crypto: z.unknown(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export class UserResponseDto extends createZodDto(userResponseSchema) {}

export type UserResponse = z.infer<typeof userResponseSchema>;

export function toUserResponse(user: User): UserResponse {
  const { password, ...rest } = user;
  void password;
  return {
    ...rest,
    createdAt: rest.createdAt.toISOString(),
    updatedAt: rest.updatedAt.toISOString(),
  };
}
