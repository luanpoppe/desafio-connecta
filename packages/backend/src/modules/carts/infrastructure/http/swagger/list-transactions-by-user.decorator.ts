import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { ListTransactionsResponseDto } from '../dtos/transactions-list.response.dto';

const userIdQuery = ApiQuery({
  name: 'userId',
  required: true,
  description: 'Identificador interno do utilizador (`User.id`)',
  example: 1,
});

export function ApiListTransactionsByUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar transações persistidas por utilizador',
      description:
        'Devolve transações sincronizadas na base de dados para o utilizador indicado.',
    }),
    userIdQuery,
    ApiOkResponse({
      description: 'Lista de transações com produtos',
      type: ListTransactionsResponseDto.Output,
    }),
    ZodSerializerDto(ListTransactionsResponseDto),
  );
}
