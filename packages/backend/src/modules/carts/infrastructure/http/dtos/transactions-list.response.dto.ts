import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const transactionProductLineResponseSchema = z.object({
  id: z.number().int(),
  productExternalId: z.number().int(),
  title: z.string(),
  price: z.number(),
  quantity: z.number().int(),
  total: z.number(),
  discountPercentage: z.number(),
  discountedTotal: z.number(),
  thumbnail: z.string(),
});

export const transactionWithProductsResponseSchema = z.object({
  id: z.number().int(),
  externalId: z.number().int(),
  userId: z.number().int(),
  total: z.number(),
  discountedTotal: z.number(),
  totalProducts: z.number().int(),
  totalQuantity: z.number().int(),
  products: z.array(transactionProductLineResponseSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const listTransactionsResponseSchema = z.object({
  transactions: z.array(transactionWithProductsResponseSchema),
});

export class ListTransactionsResponseDto extends createZodDto(
  listTransactionsResponseSchema,
) {}

export type ListTransactionsResponse = z.infer<
  typeof listTransactionsResponseSchema
>;
