import { z } from 'zod';

export const cartProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  total: z.number(),
  discountPercentage: z.number(),
  discountedTotal: z.number(),
  thumbnail: z.string(),
});

export const cartSchema = z.object({
  id: z.number(),
  products: z.array(cartProductSchema),
  total: z.number(),
  discountedTotal: z.number(),
  userId: z.number(),
  totalProducts: z.number(),
  totalQuantity: z.number(),
});

export const getCartsResponseSchema = z.object({
  carts: z.array(cartSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type CartProductDto = z.infer<typeof cartProductSchema>;
export type CartDto = z.infer<typeof cartSchema>;
export type GetCartsResponseDto = z.infer<typeof getCartsResponseSchema>;
