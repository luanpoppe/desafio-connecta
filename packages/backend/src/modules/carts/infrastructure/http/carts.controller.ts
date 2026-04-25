import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import type { CartDto, GetCartsResponseDto } from '@/lib/external-api';
import { FetchCartByCartIdUseCase } from '../../application/use-cases/fetch-cart-by-cart-id.use-case';
import { ListCartsByInternalUserIdUseCase } from '../../application/use-cases/list-carts-by-internal-user-id.use-case';
import { ListCartsByUserQueryDto } from './dtos/list-carts-by-user.query.dto';
import { CartsHttpApiTag } from './swagger/carts-http-api-tag.decorator';
import { ApiGetLiveCartByCartId } from './swagger/get-live-cart-by-cart-id.decorator';
import { ApiListCartsByUser } from './swagger/list-carts-by-user.decorator';

@CartsHttpApiTag()
@Controller('carts')
export class CartsController {
  constructor(
    private readonly fetchLiveCartByCartId: FetchCartByCartIdUseCase,
    private readonly listCartsByInternalUserId: ListCartsByInternalUserIdUseCase,
  ) {}

  @Get(':cartId')
  @ApiGetLiveCartByCartId()
  async getLiveCart(
    @Param('cartId', ParseIntPipe) cartId: number,
  ): Promise<CartDto> {
    return this.fetchLiveCartByCartId.execute(cartId);
  }

  @Get()
  @ApiListCartsByUser()
  async listByUser(
    @Query() query: ListCartsByUserQueryDto,
  ): Promise<GetCartsResponseDto> {
    return this.listCartsByInternalUserId.execute(Number(query.userId));
  }
}
