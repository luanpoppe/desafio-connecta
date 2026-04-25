import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { LiveCartResponseDto } from '../dtos/live-cart.response.dto';
import { cartIdPathParam } from './cart-id-path-param.decorator';

export function ApiGetLiveCartByCartId() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obter carrinho atual na API externa',
      description:
        'Consulta o recurso de carrinho na API externa pelo identificador do carrinho na origem.',
    }),
    cartIdPathParam,
    ApiOkResponse({
      description: 'Payload do carrinho na origem',
      type: LiveCartResponseDto.Output,
    }),
    ZodSerializerDto(LiveCartResponseDto),
  );
}
