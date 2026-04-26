import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CartDto } from "../../../../api/@types/cart.types";
import { TransactionsError, TransactionsLoading, TransactionsTable } from "../CustomerTransactionsViews";

const cart: CartDto = {
  id: 5,
  total: 10,
  discountedTotal: 9,
  userId: 1,
  totalProducts: 1,
  totalQuantity: 1,
};

describe("TransactionsLoading", () => {
  it("renders spinner message", () => {
    render(<TransactionsLoading />);
    expect(screen.getByText(/A carregar/i)).toBeInTheDocument();
  });
});

describe("TransactionsError", () => {
  it("renders error copy", () => {
    render(<TransactionsError />);
    expect(screen.getByText(/Não foi possível carregar as transações deste cliente/i)).toBeInTheDocument();
  });
});

describe("TransactionsTable", () => {
  it("shows empty message when there are no carts", () => {
    render(<TransactionsTable carts={[]} onSelectTransaction={jest.fn()} />);
    expect(screen.getByText(/Sem transações para este cliente/i)).toBeInTheDocument();
  });

  it("calls onSelectTransaction on row click and keyboard", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(<TransactionsTable carts={[cart]} onSelectTransaction={onSelect} />);

    const row = screen.getByRole("row", { name: /identificador 5/i });
    await user.click(row);
    expect(onSelect).toHaveBeenCalledWith(5);

    onSelect.mockClear();
    row.focus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith(5);
  });
});
