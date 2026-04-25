import type { User as PrismaUser } from '@/generated/prisma/client';
import type { User } from '../../domain/entities/user.entity';

export class PrismaUserMapper {
  static toDomain(row: PrismaUser): User {
    return {
      id: row.id,
      externalId: row.externalId,
      firstName: row.firstName,
      lastName: row.lastName,
      maidenName: row.maidenName,
      age: row.age,
      gender: row.gender,
      email: row.email,
      phone: row.phone,
      username: row.username,
      password: row.password,
      birthDate: row.birthDate,
      image: row.image,
      bloodGroup: row.bloodGroup,
      height: row.height,
      weight: row.weight,
      eyeColor: row.eyeColor,
      hair: row.hair,
      ip: row.ip,
      address: row.address,
      macAddress: row.macAddress,
      university: row.university,
      bank: row.bank,
      company: row.company,
      ein: row.ein,
      ssn: row.ssn,
      userAgent: row.userAgent,
      crypto: row.crypto,
      role: row.role,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
