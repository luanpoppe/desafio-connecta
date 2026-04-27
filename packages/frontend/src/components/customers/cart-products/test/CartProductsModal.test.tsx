import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCartByIdQuery } from "../../../../queries/useCartByIdQuery";
import { CartProductsModal } from "../CartProductsModal";

jest.mock("../../../../queries/useCartByIdQuery");

const mockedUseCart = useCartByIdQuery as jest.MockedFunction<typeof useCartByIdQuery>;

describe("CartProductsModal", () => {
  const onOpenChange = jest.fn();

  beforeEach(() => {
    onOpenChange.mockReset();
    mockedUseCart.mockReset();
  });

  it("returns null when closed", () => {
    mockedUseCart.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useCartByIdQuery>);
    render(<CartProductsModal open={false} cartId={null} onOpenChange={onOpenChange} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows loading when query is pending", () => {
    mockedUseCart.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useCartByIdQuery>);
    render(<CartProductsModal open cartId={9} onOpenChange={onOpenChange} />);
    expect(screen.getByText(/A carregar produtos/i)).toBeInTheDocument();
    expect(mockedUseCart).toHaveBeenCalledWith(9, { enabled: true });
  });

  it("shows error UI when query errors", () => {
    mockedUseCart.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      error: new Error("boom"),
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useCartByIdQuery>);
    render(<CartProductsModal open cartId={9} onOpenChange={onOpenChange} />);
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("shows summary and table when data is ready", () => {
    mockedUseCart.mockReturnValue({
      data: {
        id: 9,
        products: [
          {
            id: 1,
            title: "Item",
            price: 5,
            quantity: 1,
            total: 5,
            discountPercentage: 0,
            discountedTotal: 5,
            thumbnail: "https://example.com/p.png",
          },
        ],
        total: 5,
        discountedTotal: 5,
        userId: 1,
        totalProducts: 1,
        totalQuantity: 1,
      },
      isPending: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useCartByIdQuery>);
    render(<CartProductsModal open cartId={9} onOpenChange={onOpenChange} />);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("table")).toBeInTheDocument();
    expect(within(within(dialog).getByRole("table")).getByText("Item")).toBeInTheDocument();
  });

  it("passes enabled false when modal is closed", () => {
    mockedUseCart.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useCartByIdQuery>);
    render(<CartProductsModal open={false} cartId={9} onOpenChange={onOpenChange} />);
    expect(mockedUseCart).toHaveBeenCalledWith(9, expect.objectContaining({ enabled: false }));
  });

  it("invokes onOpenChange when modal close is triggered", async () => {
    const user = userEvent.setup();
    mockedUseCart.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as unknown as ReturnType<typeof useCartByIdQuery>);
    render(<CartProductsModal open cartId={1} onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
