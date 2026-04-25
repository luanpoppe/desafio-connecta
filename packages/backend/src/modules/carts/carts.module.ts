import { Module } from '@nestjs/common';
import { FetchLiveCartByTransactionDbIdUseCase } from './application/use-cases/fetch-live-cart-by-transaction-db-id.use-case';
import { ListTransactionsByUserDbIdUseCase } from './application/use-cases/list-transactions-by-user-db-id.use-case';
import { TRANSACTION_REPOSITORY } from './domain/repositories/transaction.repository.token';
import { CartsController } from './infrastructure/http/carts.controller';
import { PrismaTransactionRepository } from './infrastructure/repositories/prisma-transaction.repository';

@Module({
  imports: [],
  controllers: [CartsController],
  providers: [
    PrismaTransactionRepository,
    {
      provide: TRANSACTION_REPOSITORY,
      useExisting: PrismaTransactionRepository,
    },
    FetchLiveCartByTransactionDbIdUseCase,
    ListTransactionsByUserDbIdUseCase,
  ],
  exports: [
    TRANSACTION_REPOSITORY,
    FetchLiveCartByTransactionDbIdUseCase,
    ListTransactionsByUserDbIdUseCase,
  ],
})
export class CartsModule {}
