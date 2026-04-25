import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import type { PaginatedUsers } from '../../../domain/repositories/paginated-users';
import { toUserResponse, userResponseSchema } from './user-response.dto';

export const paginatedUsersResponseSchema = z.object({
  items: z.array(userResponseSchema),
  totalItems: z.number().int().min(0),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
});

export class PaginatedUsersResponseDto extends createZodDto(
  paginatedUsersResponseSchema,
) {}

export type PaginatedUsersResponse = z.infer<
  typeof paginatedUsersResponseSchema
>;

export function toPaginatedUsersResponse(
  data: PaginatedUsers,
): PaginatedUsersResponse {
  return {
    items: data.items.map(toUserResponse),
    totalItems: data.totalItems,
    page: data.page,
    pageSize: data.pageSize,
  };
}
