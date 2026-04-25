import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const userTransactionCountResponseSchema = z.object({
  count: z.number().int().min(0),
});

export class UserTransactionCountResponseDto extends createZodDto(
  userTransactionCountResponseSchema,
) {}

export type UserTransactionCountResponse = z.infer<
  typeof userTransactionCountResponseSchema
>;
