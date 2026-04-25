import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/** `userId` é o identificador interno do utilizador (`User.id`). */
export const listCartsByUserQuerySchema = z.object({
  userId: z.coerce.number().int().positive(),
});

export class ListCartsByUserQueryDto extends createZodDto(
  listCartsByUserQuerySchema,
) {}
