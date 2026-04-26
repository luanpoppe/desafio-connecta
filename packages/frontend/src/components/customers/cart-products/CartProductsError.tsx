import { Button } from "@connecta/design-system";

interface CartProductsErrorProps {
  error: unknown;
  isRefetching: boolean;
  onRetry: () => void;
  onClose: () => void;
}

export function CartProductsError({
  error,
  isRefetching,
  onRetry,
  onClose,
}: CartProductsErrorProps) {
  return (
    <div className="space-y-3 text-sm text-text-secondary">
      <p>{error instanceof Error ? error.message : "Não foi possível carregar o carrinho."}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => void onRetry()}>
          {isRefetching ? "A tentar…" : "Tentar novamente"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
}
