import type { TransactionWithProducts } from '../../domain/entities/transaction-with-products.entity';
import type { ListTransactionsResponse } from '../http/dtos/transactions-list.response.dto';
import { transactionWithProductsResponseSchema } from '../http/dtos/transactions-list.response.dto';
import { z } from 'zod';

export class TransactionsListResponseMapper {
  static toHttp(
    items: readonly TransactionWithProducts[],
  ): ListTransactionsResponse {
    return {
      transactions: items.map((tx) =>
        TransactionsListResponseMapper.toTransactionItem(tx),
      ),
    };
  }

  private static toTransactionItem(
    tx: TransactionWithProducts,
  ): z.infer<typeof transactionWithProductsResponseSchema> {
    return {
      id: tx.id,
      externalId: tx.externalId,
      userId: tx.userId,
      total: tx.total,
      discountedTotal: tx.discountedTotal,
      totalProducts: tx.totalProducts,
      totalQuantity: tx.totalQuantity,
      products: tx.products.map((p) => ({
        id: p.id,
        productExternalId: p.productExternalId,
        title: p.title,
        price: p.price,
        quantity: p.quantity,
        total: p.total,
        discountPercentage: p.discountPercentage,
        discountedTotal: p.discountedTotal,
        thumbnail: p.thumbnail,
      })),
      createdAt: tx.createdAt.toISOString(),
      updatedAt: tx.updatedAt.toISOString(),
    };
  }
}
