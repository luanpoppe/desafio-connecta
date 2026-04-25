import type { TransactionWithProducts } from '../entities/transaction-with-products.entity';

/**
 * Leitura de transações (carrinhos) persistidas.
 * `internalUserId` é o `User.id` interno; a listagem resolve a relação com `Transaction.userId` (externo).
 */
export interface TransactionRepository {
  findExternalIdByInternalTransactionId(
    internalTransactionId: number,
  ): Promise<number | null>;

  listByInternalUserId(
    internalUserId: number,
  ): Promise<readonly TransactionWithProducts[]>;
}
