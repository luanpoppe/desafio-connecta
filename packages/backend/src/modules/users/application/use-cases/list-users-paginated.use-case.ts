import { Inject, Injectable } from '@nestjs/common';
import type { ListUsersParams } from '../../domain/repositories/list-users.params';
import type { PaginatedUsers } from '../../domain/repositories/paginated-users';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';

@Injectable()
export class ListUsersPaginatedUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  execute(params: ListUsersParams): Promise<PaginatedUsers> {
    return this.userRepository.listAllPaginated(params);
  }
}
