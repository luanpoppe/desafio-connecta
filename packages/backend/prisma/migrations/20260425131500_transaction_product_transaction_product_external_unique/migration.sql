-- At most one row per product catalog id per transaction (DummyJSON carts use `id` once per cart).
CREATE UNIQUE INDEX "transaction_products_transactionId_productExternalId_key" ON "transaction_products"("transactionId", "productExternalId");
