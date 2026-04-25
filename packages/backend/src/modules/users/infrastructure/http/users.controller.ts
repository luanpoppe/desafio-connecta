import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CountUserTransactionsUseCase } from '../../application/use-cases/count-user-transactions.use-case';
import { ListUsersPaginatedUseCase } from '../../application/use-cases/list-users-paginated.use-case';
import { SumUserTransactionTotalsUseCase } from '../../application/use-cases/sum-user-transaction-totals.use-case';
import type { ListUsersParams } from '../../domain/repositories/list-users.params';
import type { PaginatedUsers } from '../../domain/repositories/paginated-users';
import { ListUsersQueryDto } from './dtos/list-users.query.dto';
import {
  toPaginatedUsersResponse,
  type PaginatedUsersResponse,
} from './dtos/paginated-users.response.dto';
import { ApiGetUserTransactionCount } from './swagger/get-user-transaction-count.decorator';
import { ApiGetUserTransactionTotalSum } from './swagger/get-user-transaction-total-sum.decorator';
import { ApiListUsersPaginated } from './swagger/list-users-paginated.decorator';
import { UsersHttpApiTag } from './swagger/users-http-api-tag.decorator';

@UsersHttpApiTag()
@Controller('users')
export class UsersController {
  constructor(
    private readonly listUsersPaginated: ListUsersPaginatedUseCase,
    private readonly countUserTransactions: CountUserTransactionsUseCase,
    private readonly sumUserTransactionTotals: SumUserTransactionTotalsUseCase,
  ) {}

  @Get()
  @ApiListUsersPaginated()
  async listPaginated(
    @Query() query: ListUsersQueryDto,
  ): Promise<PaginatedUsersResponse> {
    const params: ListUsersParams = {
      page: Number(query.page),
      pageSize: Number(query.pageSize),
    };
    const usersPage: PaginatedUsers =
      await this.listUsersPaginated.execute(params);
    return toPaginatedUsersResponse(usersPage);
  }

  @Get(':userId/transactions/count')
  @ApiGetUserTransactionCount()
  async getTransactionCount(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ count: number }> {
    const count = await this.countUserTransactions.execute(userId);
    return { count };
  }

  @Get(':userId/transactions/total-sum')
  @ApiGetUserTransactionTotalSum()
  async getTransactionTotalSum(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ totalSum: number }> {
    const totalSum = await this.sumUserTransactionTotals.execute(userId);
    return { totalSum };
  }
}
