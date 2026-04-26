import { render, screen } from "@testing-library/react";
import { Header } from "../Header";

describe("Header", () => {
  it("renders title and subtitle", () => {
    render(<Header />);
    expect(screen.getByRole("heading", { name: /Clientes e transações/i })).toBeInTheDocument();
    expect(screen.getByText(/Selecione um cliente para ver os carrinhos/i)).toBeInTheDocument();
  });
});
