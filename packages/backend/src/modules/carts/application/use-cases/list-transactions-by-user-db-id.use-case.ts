import { Inject, Injectable } from '@nestjs/common';
import type { TransactionWithProducts } from '../../domain/entities/transaction-with-products.entity';
import type { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/transaction.repository.token';

@Injectable()
export class ListTransactionsByUserDbIdUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  execute(
    internalUserId: number,
  ): Promise<readonly TransactionWithProducts[]> {
    return this.transactionRepository.listByInternalUserId(internalUserId);
  }
}
