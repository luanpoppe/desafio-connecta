import { Module } from '@nestjs/common';
import { CountUserTransactionsUseCase } from './application/use-cases/count-user-transactions.use-case';
import { ListUsersPaginatedUseCase } from './application/use-cases/list-users-paginated.use-case';
import { SumUserTransactionTotalsUseCase } from './application/use-cases/sum-user-transaction-totals.use-case';
import { USER_REPOSITORY } from './domain/repositories/user.repository.token';
import { UsersController } from './infrastructure/http/users.controller';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    PrismaUserRepository,
    { provide: USER_REPOSITORY, useExisting: PrismaUserRepository },
    ListUsersPaginatedUseCase,
    CountUserTransactionsUseCase,
    SumUserTransactionTotalsUseCase,
  ],
  exports: [
    USER_REPOSITORY,
    ListUsersPaginatedUseCase,
    CountUserTransactionsUseCase,
    SumUserTransactionTotalsUseCase,
  ],
})
export class UsersModule {}
