import type { ListUsersParams } from './list-users.params';
import type { PaginatedUsers } from './paginated-users';

/**
 * Porta de persistência do agregado de utilizador.
 * `userId` refere-se ao identificador interno (`User.id`), não ao `externalId` da API.
 */
export interface UserRepository {
  listAllPaginated(params: ListUsersParams): Promise<PaginatedUsers>;

  countTransactionsByUserId(userId: number): Promise<number>;

  sumTransactionTotalsByUserId(userId: number): Promise<number>;
}
