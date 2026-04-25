import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { PaginatedUsersResponseDto } from '../dtos/paginated-users.response.dto';

export function ApiListUsersPaginated() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar utilizadores com paginação' }),
    ApiOkResponse({
      description: 'Página de utilizadores',
      type: PaginatedUsersResponseDto.Output,
    }),
    ZodSerializerDto(PaginatedUsersResponseDto),
  );
}
