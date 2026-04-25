import type { CartDto, GetCartsResponseDto } from '@/lib/external-api';

export const EXTERNAL_CARTS_GATEWAY = Symbol('EXTERNAL_CARTS_GATEWAY');

export interface ExternalCartsGateway {
  getCartsByUser(externalUserId: number): Promise<GetCartsResponseDto>;
  getCartById(cartId: number): Promise<CartDto>;
}
