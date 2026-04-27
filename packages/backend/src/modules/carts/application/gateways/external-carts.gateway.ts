import type { InjectionToken } from '@nestjs/common';
import type { CartDto, GetCartsResponseDto } from '@/lib/external-api';

export interface ExternalCartsGateway {
  getCartsByUser(externalUserId: number): Promise<GetCartsResponseDto>;
  getCartById(cartId: number): Promise<CartDto>;
}

export const EXTERNAL_CARTS_GATEWAY: InjectionToken = Symbol('EXTERNAL_CARTS_GATEWAY');
