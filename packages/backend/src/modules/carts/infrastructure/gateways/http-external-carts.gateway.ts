import { ExternalApiService } from '@/lib/external-api';
import { Injectable } from '@nestjs/common';
import type { ExternalCartsGateway } from '../../application/gateways/external-carts.gateway';

@Injectable()
export class HttpExternalCartsGateway implements ExternalCartsGateway {
  constructor(private readonly externalApi: ExternalApiService) {}

  getCartsByUser(externalUserId: number) {
    return this.externalApi.getCartsByUser(externalUserId);
  }

  getCartById(cartId: number) {
    return this.externalApi.getCartById(cartId);
  }
}
