import { api } from "./api-client";
import type {
  CartsByUserWithSummaryResponse,
  LiveCartDto,
} from "./@types/cart.types";

export async function fetchCartsByUserId(
  internalUserId: number,
): Promise<CartsByUserWithSummaryResponse> {
  const { data } = await api.get<CartsByUserWithSummaryResponse>("/carts", {
    params: { userId: internalUserId },
  });
  return data;
}

export async function fetchCartById(cartId: number): Promise<LiveCartDto> {
  const { data } = await api.get<LiveCartDto>(`/carts/${cartId}`);
  return data;
}
