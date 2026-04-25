-- DropForeignKey
ALTER TABLE "transaction_products" DROP CONSTRAINT IF EXISTS "transaction_products_transactionId_fkey";

ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "transactions_userId_fkey";

-- DropTable
DROP TABLE IF EXISTS "transaction_products";

DROP TABLE IF EXISTS "transactions";
