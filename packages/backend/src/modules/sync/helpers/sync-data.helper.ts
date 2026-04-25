import { PrismaService } from '@/lib/database/prisma.service';
import type { CartDto, ExternalUserDto } from '@/lib/external-api';
import {
  ExternalCartToPrismaMapper,
  type TransactionProductRow,
} from '../mappers/transaction.mapper';
import { ExternalUserToPrismaMapper } from '../mappers/user.mapper';

type TransactionScope = Pick<
  PrismaService,
  'transaction' | 'transactionProduct'
>;

export class SyncDataHelper {
  static readonly USER_UPSERT_BATCH_SIZE = 5;
  static readonly CART_TRANSACTION_BATCH_SIZE = 5;

  static async persistExternalUsers(
    prisma: PrismaService,
    users: ExternalUserDto[],
  ): Promise<void> {
    for (
      let i = 0;
      i < users.length;
      i += SyncDataHelper.USER_UPSERT_BATCH_SIZE
    ) {
      const batch = users.slice(i, i + SyncDataHelper.USER_UPSERT_BATCH_SIZE);

      const promises = batch.map((externalUser) => {
        const fields = ExternalUserToPrismaMapper.map(externalUser);
        return prisma.user.upsert({
          where: { externalId: externalUser.id },
          create: { externalId: externalUser.id, ...fields },
          update: fields,
        });
      });

      await Promise.all(promises);
    }
  }

  static async persistExternalCarts(
    prisma: PrismaService,
    carts: CartDto[],
  ): Promise<void> {
    for (
      let i = 0;
      i < carts.length;
      i += SyncDataHelper.CART_TRANSACTION_BATCH_SIZE
    ) {
      const cartBatch = carts.slice(
        i,
        i + SyncDataHelper.CART_TRANSACTION_BATCH_SIZE,
      );

      const promises = cartBatch.map((cart) =>
        SyncDataHelper.upsertCartTransaction(prisma, cart),
      );
      await Promise.all(promises);
    }
  }

  private static async upsertCartTransaction(
    prisma: PrismaService,
    cart: CartDto,
  ): Promise<void> {
    const transactionFields =
      ExternalCartToPrismaMapper.mapTransactionFields(cart);
    const productRows = ExternalCartToPrismaMapper.mapProductRows(cart);

    await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.upsert({
        where: { externalId: cart.id },
        create: { externalId: cart.id, ...transactionFields },
        update: transactionFields,
      });

      await SyncDataHelper.persistNewTransactionProducts(
        tx,
        transaction.id,
        productRows,
      );
    });
  }

  private static async persistNewTransactionProducts(
    tx: TransactionScope,
    transactionId: number,
    productRows: TransactionProductRow[],
  ): Promise<void> {
    if (productRows.length === 0) return;

    const transactionProducts = await tx.transactionProduct.findMany({
      where: { transactionId },
      select: { productExternalId: true },
    });

    const productExternalsIds = transactionProducts.map(
      (r) => r.productExternalId,
    );
    const existingIds = new Set(productExternalsIds);

    const toCreate = productRows.filter(
      (row) => !existingIds.has(row.productExternalId),
    );

    if (toCreate.length === 0) return;

    const data = toCreate.map((row) => ({
      transactionId,
      ...row,
    }));

    await tx.transactionProduct.createMany({
      data,
    });
  }
}
