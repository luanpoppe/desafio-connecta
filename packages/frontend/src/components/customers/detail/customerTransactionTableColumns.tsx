import type { ReactNode } from "react";
import type { CartDto } from "../../../api/@types/cart.types";
import { money } from "../customers.constants";

export interface CustomerTransactionTableColumn {
  id: string;
  header: string;
  cell: (cart: CartDto) => ReactNode;
  align?: "right";
  className?: string;
  muted?: boolean;
}

export const CUSTOMER_TRANSACTION_TABLE_COLUMNS: CustomerTransactionTableColumn[] = [
  { id: "id", header: "ID", cell: (c) => c.id },
  {
    id: "total",
    header: "Total",
    align: "right",
    className: "text-accent-foreground font-[500]",
    cell: (c) => money.format(c.total),
  },
  { id: "totalProducts", header: "Produtos", align: "right", cell: (c) => c.totalProducts },
  { id: "totalQuantity", header: "Qtd.", align: "right", cell: (c) => c.totalQuantity },
  {
    id: "discountedTotal",
    header: "Total c/ desc.",
    align: "right",
    className: "text-accent-foreground font-[500]",
    cell: (c) => money.format(c.discountedTotal),
  },
];
