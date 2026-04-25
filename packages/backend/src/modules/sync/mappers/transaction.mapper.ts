import type { Prisma } from '@/generated/prisma/client';
import type { CartDto, CartProductDto } from '@/lib/external-api';

export type TransactionScalarFields = Omit<
  Prisma.TransactionUncheckedCreateInput,
  'externalId' | 'products' | 'id' | 'createdAt' | 'updatedAt'
>;

export type TransactionProductRow = Omit<
  Prisma.TransactionProductCreateManyInput,
  'transactionId' | 'id'
>;

export class ExternalCartToPrismaMapper {
  static mapTransactionFields(cart: CartDto): TransactionScalarFields {
    return {
      userId: cart.userId,
      total: cart.total,
      discountedTotal: cart.discountedTotal,
      totalProducts: cart.totalProducts,
      totalQuantity: cart.totalQuantity,
    };
  }

  static mapProductRows(cart: CartDto): TransactionProductRow[] {
    return cart.products.map((p) => CartProductToPrismaMapper.map(p));
  }
}

export class CartProductToPrismaMapper {
  static map(dto: CartProductDto): TransactionProductRow {
    return {
      productExternalId: dto.id,
      title: dto.title,
      price: dto.price,
      quantity: dto.quantity,
      total: dto.total,
      discountPercentage: dto.discountPercentage,
      discountedTotal: dto.discountedTotal,
      thumbnail: dto.thumbnail,
    };
  }
}
