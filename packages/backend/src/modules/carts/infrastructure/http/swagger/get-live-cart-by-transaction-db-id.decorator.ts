import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { LiveCartResponseDto } from '../dtos/live-cart.response.dto';
import { transactionDbIdPathParam } from './transaction-db-id-param.decorator';

export function ApiGetLiveCartByTransactionDbId() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obter carrinho atual na API externa',
      description:
        'Resolve `Transaction.id` interno para `externalId` e chama o recurso de carrinho na API externa.',
    }),
    transactionDbIdPathParam,
    ApiOkResponse({
      description: 'Payload do carrinho na origem',
      type: LiveCartResponseDto.Output,
    }),
    ZodSerializerDto(LiveCartResponseDto),
  );
}
