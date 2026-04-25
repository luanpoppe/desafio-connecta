import type { User } from '../entities/user.entity';

export interface PaginatedUsers {
  readonly items: readonly User[];
  readonly totalItems: number;
  readonly page: number;
  readonly pageSize: number;
}
