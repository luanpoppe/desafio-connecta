import type { Prisma } from '@/generated/prisma/client';
import type {
  TransactionProductLine,
  TransactionWithProducts,
} from '../../domain/entities/transaction-with-products.entity';

export type TransactionWithProductsRow = Prisma.TransactionGetPayload<{
  include: { products: true };
}>;

export class PrismaTransactionMapper {
  static toDomain(row: TransactionWithProductsRow): TransactionWithProducts {
    return {
      id: row.id,
      externalId: row.externalId,
      userId: row.userId,
      total: row.total,
      discountedTotal: row.discountedTotal,
      totalProducts: row.totalProducts,
      totalQuantity: row.totalQuantity,
      products: row.products.map(toProductLine),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

function toProductLine(
  row: TransactionWithProductsRow['products'][number],
): TransactionProductLine {
  return {
    id: row.id,
    productExternalId: row.productExternalId,
    title: row.title,
    price: row.price,
    quantity: row.quantity,
    total: row.total,
    discountPercentage: row.discountPercentage,
    discountedTotal: row.discountedTotal,
    thumbnail: row.thumbnail,
  };
}
