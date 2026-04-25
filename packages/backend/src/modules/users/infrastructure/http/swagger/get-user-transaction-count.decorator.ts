import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserTransactionCountResponseDto } from '../dtos/user-transaction-count.response.dto';
import { userIdPathParam } from './user-id-param.decorator';

export function ApiGetUserTransactionCount() {
  return applyDecorators(
    ApiOperation({ summary: 'Contar transações de um utilizador' }),
    userIdPathParam,
    ApiOkResponse({
      description: 'Número de transações',
      type: UserTransactionCountResponseDto.Output,
    }),
    ZodSerializerDto(UserTransactionCountResponseDto),
  );
}
