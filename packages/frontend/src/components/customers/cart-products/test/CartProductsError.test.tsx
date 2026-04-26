import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProductsError } from "../CartProductsError";

describe("CartProductsError", () => {
  it("shows Error message when error is Error", () => {
    render(
      <CartProductsError
        error={new Error("Falhou tudo")}
        isRefetching={false}
        onRetry={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Falhou tudo")).toBeInTheDocument();
  });

  it("shows generic message for non-Error", () => {
    render(
      <CartProductsError
        error="string"
        isRefetching={false}
        onRetry={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText(/Não foi possível carregar o carrinho/i)).toBeInTheDocument();
  });

  it("calls onRetry and onClose from buttons", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    const onClose = jest.fn();
    render(
      <CartProductsError
        error={new Error("x")}
        isRefetching={false}
        onRetry={onRetry}
        onClose={onClose}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Tentar novamente/i }));
    expect(onRetry).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /Fechar/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows refetching label on retry button", () => {
    render(
      <CartProductsError
        error={new Error("x")}
        isRefetching
        onRetry={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /A tentar/i })).toBeInTheDocument();
  });
});
