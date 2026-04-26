import type { ReactNode } from "react";
import type { CartProductDto } from "../../../api/@types/product.types";
import { money } from "../customers.constants";
import { formatLineDiscount } from "./utils";

export interface ProductTableColumn {
  id: string;
  header: string;
  cell: (p: CartProductDto) => ReactNode;
  align?: "right";
  muted?: boolean;
  className?: string;
}

export const PRODUCT_TABLE_COLUMNS: ProductTableColumn[] = [
  {
    id: "title",
    header: "Produto",
    className: "min-w-0 max-w-[min(100%,18rem)] whitespace-normal",
    cell: (p) => (
      <span className="flex items-center gap-3 min-w-0">
        <img
          src={p.thumbnail}
          alt=""
          className="size-10 shrink-0 rounded-md border border-border/60 bg-surface-inset object-cover"
        />
        <span className="line-clamp-2 text-sm text-text font-[500]">
          {p.title}
        </span>
      </span>
    ),
  },
  {
    id: "quantity",
    header: "Qtd.",
    align: "right",
    muted: true,
    cell: (p) => p.quantity,
  },
  {
    id: "price",
    header: "Preço",
    align: "right",
    muted: true,
    cell: (p) => money.format(p.price),
  },
  {
    id: "discount",
    header: "Desc.",
    align: "right",
    muted: true,
    cell: (p) => formatLineDiscount(p.discountPercentage),
  },
  {
    id: "lineTotal",
    header: "Subtotal",
    align: "right",
    className: "text-text font-[500]",
    cell: (p) => money.format(p.total),
  },
  {
    id: "lineDiscounted",
    header: "Subt. c/ desc.",
    align: "right",
    className: "text-accent-foreground font-[500]",
    cell: (p) => money.format(p.discountedTotal),
  },
];
