import { api } from "./api-client";
import type { PaginatedUsersResponse } from "./@types/user.types";

export async function fetchUsersPage(
  page: number,
  pageSize: number,
): Promise<PaginatedUsersResponse> {
  const { data } = await api.get<PaginatedUsersResponse>("/users", {
    params: { page, pageSize },
  });
  return data;
}
