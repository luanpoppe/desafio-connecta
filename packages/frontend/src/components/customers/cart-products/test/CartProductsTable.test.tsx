import { render, screen, within } from "@testing-library/react";
import type { CartProductDto } from "../../../../api/@types/product.types";
import { CartProductsTable } from "../CartProductsTable";

const product: CartProductDto = {
  id: 1,
  title: "Widget",
  price: 10,
  quantity: 2,
  total: 20,
  discountPercentage: 0.1,
  discountedTotal: 18,
  thumbnail: "https://example.com/t.png",
};

describe("CartProductsTable", () => {
  it("renders column headers and product cells", () => {
    render(<CartProductsTable products={[product]} />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("Produto")).toBeInTheDocument();
    expect(within(table).getByText("Widget")).toBeInTheDocument();
    expect(within(table).getByText("10%")).toBeInTheDocument();
    expect(within(table).getByText("2")).toBeInTheDocument();
  });
});
