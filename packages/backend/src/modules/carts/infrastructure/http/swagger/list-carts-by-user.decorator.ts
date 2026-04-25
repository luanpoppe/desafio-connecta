import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { CartsByUserResponseDto } from '../dtos/carts-by-user.response.dto';

const userIdQuery = ApiQuery({
  name: 'userId',
  required: true,
  description: 'Identificador interno do utilizador (`User.id`)',
  example: 1,
});

export function ApiListCartsByUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar carrinhos do utilizador na API externa',
      description:
        'Resolve `User.id` interno para `externalId` e devolve os carrinhos da API externa. Inclui `summary` com contagem de carrinhos no payload e soma dos campos `total` de cada carrinho (valores da mesma resposta).',
    }),
    userIdQuery,
    ApiOkResponse({
      description: 'Lista paginada de carrinhos (formato DummyJSON)',
      type: CartsByUserResponseDto.Output,
    }),
    ZodSerializerDto(CartsByUserResponseDto),
  );
}
