import { ExternalApiService, type CartDto } from '@/lib/external-api';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FetchCartByCartIdUseCase {
  constructor(private readonly externalApi: ExternalApiService) {}

  execute(cartId: number): Promise<CartDto> {
    return this.externalApi.getCartById(cartId);
  }
}
