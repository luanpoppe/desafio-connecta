import { cartsByUserWithSummarySchema } from '@/modules/carts/application/dtos/carts-by-user-with-summary.dto';
import { createZodDto } from 'nestjs-zod';

export class CartsByUserResponseDto extends createZodDto(
  cartsByUserWithSummarySchema,
) {}

export type { CartsByUserWithSummaryResponse } from '@/modules/carts/application/dtos/carts-by-user-with-summary.dto';
