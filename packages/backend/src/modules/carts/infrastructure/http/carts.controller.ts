import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import type { CartDto } from '@/lib/external-api';
import { FetchLiveCartByTransactionDbIdUseCase } from '../../application/use-cases/fetch-live-cart-by-transaction-db-id.use-case';
import { ListTransactionsByUserDbIdUseCase } from '../../application/use-cases/list-transactions-by-user-db-id.use-case';
import { ListTransactionsQueryDto } from './dtos/list-transactions.query.dto';
import type { ListTransactionsResponse } from './dtos/transactions-list.response.dto';
import { TransactionsListResponseMapper } from '../mappers/transactions-list-response.mapper';
import { CartsHttpApiTag } from './swagger/carts-http-api-tag.decorator';
import { ApiGetLiveCartByTransactionDbId } from './swagger/get-live-cart-by-transaction-db-id.decorator';
import { ApiListTransactionsByUser } from './swagger/list-transactions-by-user.decorator';

@CartsHttpApiTag()
@Controller('transactions')
export class CartsController {
  constructor(
    private readonly fetchLiveCartByTransactionDbId: FetchLiveCartByTransactionDbIdUseCase,
    private readonly listTransactionsByUserDbId: ListTransactionsByUserDbIdUseCase,
  ) {}

  @Get(':transactionDbId/live')
  @ApiGetLiveCartByTransactionDbId()
  async getLiveCartByTransactionDbId(
    @Param('transactionDbId', ParseIntPipe) transactionDbId: number,
  ): Promise<CartDto> {
    return this.fetchLiveCartByTransactionDbId.execute(transactionDbId);
  }

  @Get('')
  @ApiListTransactionsByUser()
  async listTransactionsByUser(
    @Query() query: ListTransactionsQueryDto,
  ): Promise<ListTransactionsResponse> {
    const items = await this.listTransactionsByUserDbId.execute(
      Number(query.userId),
    );
    return TransactionsListResponseMapper.toHttp(items);
  }
}
