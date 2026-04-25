import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function CartsHttpApiTag() {
  return applyDecorators(ApiTags('carts'));
}
