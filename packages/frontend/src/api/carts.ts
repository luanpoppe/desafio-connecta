import { api } from "./api-client";
import type { CartsByUserWithSummaryResponse } from "./@types/cart.types";

export async function fetchCartsByUserId(
  internalUserId: number,
): Promise<CartsByUserWithSummaryResponse> {
  const { data } = await api.get<CartsByUserWithSummaryResponse>("/carts", {
    params: { userId: internalUserId },
  });
  return data;
}
