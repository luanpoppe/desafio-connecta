import { useQuery } from "@tanstack/react-query";
import { fetchUsersPage } from "../api/users";

export function useUsersQuery(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: () => fetchUsersPage(page, pageSize),
    staleTime: 60_000,
    retry: 1,
  });
}
