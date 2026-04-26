import { useQuery } from "@tanstack/react-query";
import { fetchCartsByUserId } from "../api/carts";

export function useCartsByUserQuery(userId: number | null) {
  return useQuery({
    queryKey: ["carts", userId],
    queryFn: () => fetchCartsByUserId(userId!),
    enabled: userId != null,
    staleTime: 30_000,
    retry: 1,
  });
}
