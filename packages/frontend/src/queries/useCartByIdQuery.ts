import { useQuery } from "@tanstack/react-query";
import { fetchCartById } from "../api/carts";

export function useCartByIdQuery(
  cartId: number | null,
  options?: { enabled?: boolean },
) {
  const enabled = (options?.enabled ?? true) && cartId != null;
  return useQuery({
    queryKey: ["cart", "detail", cartId] as const,
    queryFn: () => fetchCartById(cartId!),
    enabled,
  });
}
