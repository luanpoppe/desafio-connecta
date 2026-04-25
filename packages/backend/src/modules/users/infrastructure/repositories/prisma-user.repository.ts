import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/database/prisma.service';
import type { ListUsersParams } from '../../domain/repositories/list-users.params';
import type { PaginatedUsers } from '../../domain/repositories/paginated-users';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listAllPaginated(params: ListUsersParams): Promise<PaginatedUsers> {
    const page = Math.max(1, params.page);
    const pageSize = Math.max(1, params.pageSize);
    const skip = (page - 1) * pageSize;

    const [rows, totalItems] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      items: rows.map((row) => PrismaUserMapper.toDomain(row)),
      totalItems,
      page,
      pageSize,
    };
  }

  async findExternalIdByInternalUserId(
    internalUserId: number,
  ): Promise<number | null> {
    const row = await this.prisma.user.findUnique({
      where: { id: internalUserId },
      select: { externalId: true },
    });
    return row?.externalId ?? null;
  }
}
