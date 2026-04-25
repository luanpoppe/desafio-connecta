import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/database/prisma.service';
import type { TransactionWithProducts } from '../../domain/entities/transaction-with-products.entity';
import type { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { PrismaTransactionMapper } from '../mappers/prisma-transaction.mapper';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findExternalIdByInternalTransactionId(
    internalTransactionId: number,
  ): Promise<number | null> {
    const row = await this.prisma.transaction.findUnique({
      where: { id: internalTransactionId },
      select: { externalId: true },
    });
    return row?.externalId ?? null;
  }

  async listByInternalUserId(
    internalUserId: number,
  ): Promise<readonly TransactionWithProducts[]> {
    const rows = await this.prisma.transaction.findMany({
      where: { user: { id: internalUserId } },
      include: { products: true },
      orderBy: { id: 'asc' },
    });
    return rows.map((row) => PrismaTransactionMapper.toDomain(row));
  }
}
