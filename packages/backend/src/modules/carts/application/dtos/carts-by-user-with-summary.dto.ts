import { getCartsResponseSchema } from '@/lib/external-api/dtos/carts.dto';
import { z } from 'zod';

/** Resumo derivado dos carrinhos presentes no payload (mesma página que a API devolveu). */
export const cartsByUserSummarySchema = z.object({
  transactionCount: z.number().int().nonnegative(),
  totalSum: z.number(),
});

export const cartsByUserWithSummarySchema = getCartsResponseSchema.extend({
  summary: cartsByUserSummarySchema,
});

export type CartsByUserWithSummaryResponse = z.infer<
  typeof cartsByUserWithSummarySchema
>;
