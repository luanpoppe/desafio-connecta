import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const userTransactionTotalSumResponseSchema = z.object({
  totalSum: z.number(),
});

export class UserTransactionTotalSumResponseDto extends createZodDto(
  userTransactionTotalSumResponseSchema,
) {}

export type UserTransactionTotalSumResponse = z.infer<
  typeof userTransactionTotalSumResponseSchema
>;
