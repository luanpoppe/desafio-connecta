import type { Prisma } from '@/generated/prisma/client';
import type { ExternalUserDto } from '@/lib/external-api';

export type UserFields = Omit<Prisma.UserCreateInput, 'externalId'>;

export class ExternalUserToPrismaMapper {
  static map(dto: ExternalUserDto): UserFields {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      maidenName: dto.maidenName,
      age: dto.age,
      gender: dto.gender,
      email: dto.email,
      phone: dto.phone,
      username: dto.username,
      password: dto.password,
      birthDate: dto.birthDate,
      image: dto.image,
      bloodGroup: dto.bloodGroup,
      height: dto.height,
      weight: dto.weight,
      eyeColor: dto.eyeColor,
      hair: dto.hair,
      ip: dto.ip,
      address: dto.address,
      macAddress: dto.macAddress,
      university: dto.university,
      bank: dto.bank,
      company: dto.company,
      ein: dto.ein,
      ssn: dto.ssn,
      userAgent: dto.userAgent,
      crypto: dto.crypto,
      role: dto.role,
    };
  }
}
