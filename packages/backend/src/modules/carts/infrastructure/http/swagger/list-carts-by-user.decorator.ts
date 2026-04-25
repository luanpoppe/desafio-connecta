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
        'Resolve `User.id` interno para `externalId` e devolve os carrinhos expostos pela API externa para esse utilizador.',
    }),
    userIdQuery,
    ApiOkResponse({
      description: 'Lista paginada de carrinhos (formato DummyJSON)',
      type: CartsByUserResponseDto.Output,
    }),
    ZodSerializerDto(CartsByUserResponseDto),
  );
}
