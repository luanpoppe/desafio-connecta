import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserTransactionTotalSumResponseDto } from '../dtos/user-transaction-total-sum.response.dto';
import { userIdPathParam } from './user-id-param.decorator';

export function ApiGetUserTransactionTotalSum() {
  return applyDecorators(
    ApiOperation({
      summary: 'Soma dos totais das transações de um utilizador',
      description:
        'Soma do campo `total` de cada transação (total do carrinho na origem).',
    }),
    userIdPathParam,
    ApiOkResponse({
      description: 'Soma dos valores `total` das transações',
      type: UserTransactionTotalSumResponseDto.Output,
    }),
    ZodSerializerDto(UserTransactionTotalSumResponseDto),
  );
}
