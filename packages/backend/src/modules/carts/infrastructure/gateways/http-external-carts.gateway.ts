import { EXTERNAL_API, type ExternalApi } from '@/lib/external-api';
import { Inject, Injectable } from '@nestjs/common';
import type { ExternalCartsGateway } from '../../application/gateways/external-carts.gateway';

@Injectable()
export class HttpExternalCartsGateway implements ExternalCartsGateway {
  constructor(@Inject(EXTERNAL_API) private readonly externalApi: ExternalApi) {}

  getCartsByUser(externalUserId: number) {
    return this.externalApi.getCartsByUser(externalUserId);
  }

  getCartById(cartId: number) {
    return this.externalApi.getCartById(cartId);
  }
}
