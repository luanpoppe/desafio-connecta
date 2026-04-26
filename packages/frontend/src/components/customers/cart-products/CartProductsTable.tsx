import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableTd,
  TableTh,
} from "@connecta/design-system";
import type { CartProductDto } from "../../../api/@types/product.types";
import { PRODUCT_TABLE_COLUMNS } from "./cartProductsTableColumns";

interface CartProductsTableProps {
  products: CartProductDto[];
}

export function CartProductsTable({ products }: CartProductsTableProps) {
  return (
    <div className="w-full max-w-full overflow-x-auto -mx-1 sm:mx-0">
      <Table>
        <TableHead>
          <TableRow>
            {PRODUCT_TABLE_COLUMNS.map((col) => (
              <TableTh
                key={col.id}
                align={col.align === "right" ? "right" : "left"}
              >
                {col.header}
              </TableTh>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              {PRODUCT_TABLE_COLUMNS.map((col) => (
                <TableTd
                  key={col.id}
                  align={col.align === "right" ? "right" : "left"}
                  muted={col.muted}
                  className={col.className}
                >
                  {col.cell(p)}
                </TableTd>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
