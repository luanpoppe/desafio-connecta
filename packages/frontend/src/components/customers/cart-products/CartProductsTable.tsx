import {
  ResponsiveDataTable,
  type ResponsiveDataColumn,
} from "@connecta/design-system";
import type { CartProductDto } from "../../../api/@types/product.types";
import { PRODUCT_TABLE_COLUMNS } from "./cartProductsTableColumns";

interface CartProductsTableProps {
  products: CartProductDto[];
}

const COLUMNS: ResponsiveDataColumn<CartProductDto>[] = PRODUCT_TABLE_COLUMNS.map(
  (c) => ({
    id: c.id,
    header: c.header,
    cell: c.cell,
    align: c.align === "right" ? "right" : "left",
    muted: c.muted,
    className: c.className,
  }),
);

export function CartProductsTable({ products }: CartProductsTableProps) {
  return (
    <ResponsiveDataTable
      rows={products}
      columns={COLUMNS}
      getRowKey={(p) => p.id}
      desktopTableWrapClassName="-mx-1 sm:mx-0"
    />
  );
}
