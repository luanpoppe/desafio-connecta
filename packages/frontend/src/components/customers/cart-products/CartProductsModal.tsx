import { Modal, Spinner } from "@connecta/design-system";
import { useCartByIdQuery } from "../../../queries/useCartByIdQuery";
import { CartLiveSummaryLine } from "./CartLiveSummaryLine";
import { CartProductsError } from "./CartProductsError";
import { CartProductsTable } from "./CartProductsTable";

interface CartProductsModalProps {
  open: boolean;
  cartId: number | null;
  onOpenChange: (open: boolean) => void;
}

export function CartProductsModal({ open, cartId, onOpenChange }: CartProductsModalProps) {
  const { data, isPending, isError, error, refetch, isRefetching } = useCartByIdQuery(cartId, {
    enabled: open && cartId != null,
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      kicker={cartId != null ? `Transação #${cartId}` : "Transação"}
      title="Produtos do carrinho"
      description="Detalhe dos itens, preços e desconto por linha."
    >
      {isPending && (
        <div className="flex items-center justify-center gap-2 py-12 text-text-muted text-sm">
          <Spinner />
          <span>A carregar produtos…</span>
        </div>
      )}

      {isError && (
        <CartProductsError
          error={error}
          isRefetching={isRefetching}
          onRetry={() => void refetch()}
          onClose={() => onOpenChange(false)}
        />
      )}

      {data && !isPending && !isError && (
        <div className="space-y-4">
          <CartLiveSummaryLine
            totalProducts={data.totalProducts}
            totalQuantity={data.totalQuantity}
            total={data.total}
            discountedTotal={data.discountedTotal}
          />
          <CartProductsTable products={data.products} />
        </div>
      )}
    </Modal>
  );
}
