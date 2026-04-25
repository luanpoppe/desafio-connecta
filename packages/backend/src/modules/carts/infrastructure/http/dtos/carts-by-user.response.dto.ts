import { getCartsResponseSchema } from '@/lib/external-api/dtos/carts.dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class CartsByUserResponseDto extends createZodDto(getCartsResponseSchema) {}

export type CartsByUserResponse = z.infer<typeof getCartsResponseSchema>;
