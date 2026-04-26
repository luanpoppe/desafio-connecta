import { money } from "../customers.constants";

type SummaryFields = {
  totalProducts: number;
  totalQuantity: number;
  total: number;
  discountedTotal: number;
};

export function CartLiveSummaryLine(data: SummaryFields) {
  return (
    <p className="text-xs text-text-muted font-[420]">
      {data.totalProducts} produto{data.totalProducts === 1 ? "" : "s"} · {data.totalQuantity} unid. ·
      Bruto {money.format(data.total)} · Com desconto {money.format(data.discountedTotal)}
    </p>
  );
}
