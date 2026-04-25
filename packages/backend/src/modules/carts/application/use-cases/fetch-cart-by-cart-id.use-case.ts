import type { CartDto } from '@/lib/external-api';
import { Inject, Injectable } from '@nestjs/common';
import {
  EXTERNAL_CARTS_GATEWAY,
  type ExternalCartsGateway,
} from '../gateways/external-carts.gateway';

@Injectable()
export class FetchCartByCartIdUseCase {
  constructor(
    @Inject(EXTERNAL_CARTS_GATEWAY)
    private readonly externalCarts: ExternalCartsGateway,
  ) {}

  execute(cartId: number): Promise<CartDto> {
    return this.externalCarts.getCartById(cartId);
  }
}
