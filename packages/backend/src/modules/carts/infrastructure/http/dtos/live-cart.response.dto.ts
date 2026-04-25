import { cartSchema } from '@/lib/external-api/dtos/carts.dto';
import { createZodDto } from 'nestjs-zod';

export class LiveCartResponseDto extends createZodDto(cartSchema) {}
