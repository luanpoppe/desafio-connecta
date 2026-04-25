import { ExternalApiService, type CartDto } from '@/lib/external-api';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/transaction.repository.token';

@Injectable()
export class FetchLiveCartByTransactionDbIdUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    private readonly externalApi: ExternalApiService,
  ) {}

  async execute(internalTransactionId: number): Promise<CartDto> {
    const externalId =
      await this.transactionRepository.findExternalIdByInternalTransactionId(
        internalTransactionId,
      );
    if (externalId === null) {
      throw new NotFoundException(
        `Transação com id ${internalTransactionId} não encontrada.`,
      );
    }
    const cart: CartDto = await this.externalApi.getCartById(externalId);
    return cart;
  }
}
