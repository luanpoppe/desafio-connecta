/** Alinhado a `userResponseSchema` no backend. */
export interface UserDto {
  id: number;
  externalId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  role: string;
}

export interface PaginatedUsersResponse {
  items: UserDto[];
  totalItems: number;
  page: number;
  pageSize: number;
}
