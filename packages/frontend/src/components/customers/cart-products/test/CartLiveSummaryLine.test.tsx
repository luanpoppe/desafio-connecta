import { render, screen } from "@testing-library/react";
import { CartLiveSummaryLine } from "../CartLiveSummaryLine";

describe("CartLiveSummaryLine", () => {
  const base = {
    totalQuantity: 2,
    total: 10,
    discountedTotal: 8,
  };

  it("uses singular produto when totalProducts is 1", () => {
    render(<CartLiveSummaryLine {...base} totalProducts={1} />);
    expect(screen.getByText(/1 produto /)).toBeInTheDocument();
  });

  it("uses plural produtos when totalProducts is not 1", () => {
    render(<CartLiveSummaryLine {...base} totalProducts={3} />);
    expect(screen.getByText(/3 produtos /)).toBeInTheDocument();
  });
});
