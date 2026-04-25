import { Controller, Get, Query } from '@nestjs/common';
import { ListUsersPaginatedUseCase } from '../../application/use-cases/list-users-paginated.use-case';
import type { ListUsersParams } from '../../domain/repositories/list-users.params';
import type { PaginatedUsers } from '../../domain/repositories/paginated-users';
import { ListUsersQueryDto } from './dtos/list-users.query.dto';
import {
  toPaginatedUsersResponse,
  type PaginatedUsersResponse,
} from './dtos/paginated-users.response.dto';
import { ApiListUsersPaginated } from './swagger/list-users-paginated.decorator';
import { UsersHttpApiTag } from './swagger/users-http-api-tag.decorator';

@UsersHttpApiTag()
@Controller('users')
export class UsersController {
  constructor(private readonly listUsersPaginated: ListUsersPaginatedUseCase) {}

  @Get()
  @ApiListUsersPaginated()
  async listPaginated(
    @Query() query: ListUsersQueryDto,
  ): Promise<PaginatedUsersResponse> {
    const params: ListUsersParams = {
      page: Number(query.page),
      pageSize: Number(query.pageSize),
    };
    const usersPage: PaginatedUsers =
      await this.listUsersPaginated.execute(params);
    return toPaginatedUsersResponse(usersPage);
  }
}
