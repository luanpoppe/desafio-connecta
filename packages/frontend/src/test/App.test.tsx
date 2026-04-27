import { render, screen } from "@testing-library/react";
import App from "../App";

jest.mock("../pages/CustomersPage", () => ({
  CustomersPage: () => <div data-testid="customers-page">CustomersPage</div>,
}));

describe("App", () => {
  it("renders the customers page shell", async () => {
    render(<App />);
    expect(await screen.findByTestId("customers-page")).toBeInTheDocument();
  });
});
