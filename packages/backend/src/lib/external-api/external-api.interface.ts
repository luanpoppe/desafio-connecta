import type { InjectionToken } from '@nestjs/common';
import type { CartDto, GetCartsResponseDto, GetUsersResponseDto } from './dtos';

export interface ExternalApi {
  getUsers(): Promise<GetUsersResponseDto>;
  getCarts(): Promise<GetCartsResponseDto>;
  getCartById(cartId: number): Promise<CartDto>;
  getCartsByUser(userId: number): Promise<GetCartsResponseDto>;
}

export const EXTERNAL_API: InjectionToken = Symbol('EXTERNAL_API');
