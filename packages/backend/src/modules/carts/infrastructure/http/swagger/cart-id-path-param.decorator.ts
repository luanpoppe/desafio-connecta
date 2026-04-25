import { ApiParam } from '@nestjs/swagger';

export const cartIdPathParam = ApiParam({
  name: 'cartId',
  description: 'Identificador do carrinho na API externa (DummyJSON)',
  example: 1,
});
