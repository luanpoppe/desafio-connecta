import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockUser } from "../../../../test/fixtures/users";
import { CustomersListPanel } from "../CustomersListPanel";

describe("CustomersListPanel", () => {
  const onPageChange = jest.fn();
  const onSelectUser = jest.fn();

  beforeEach(() => {
    onPageChange.mockReset();
    onSelectUser.mockReset();
  });

  it("shows skeleton while pending", () => {
    render(
      <CustomersListPanel
        isPending
        isError={false}
        items={[]}
        pagination={{ page: 1, pageSize: 5, totalItems: 10 }}
        onPageChange={onPageChange}
        selectedUserId={null}
        onSelectUser={onSelectUser}
      />,
    );
    expect(document.querySelector(".ds-skeleton")).toBeTruthy();
  });

  it("shows error message when isError", () => {
    render(
      <CustomersListPanel
        isPending={false}
        isError
        items={[]}
        pagination={null}
        onPageChange={onPageChange}
        selectedUserId={null}
        onSelectUser={onSelectUser}
      />,
    );
    expect(screen.getByText(/Não foi possível carregar os clientes/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Próximo" })).not.toBeInTheDocument();
  });

  it("renders table and calls onPageChange from pagination", async () => {
    const user = userEvent.setup();
    render(
      <CustomersListPanel
        isPending={false}
        isError={false}
        items={[mockUser({ id: 10 })]}
        pagination={{ page: 1, pageSize: 5, totalItems: 10 }}
        onPageChange={onPageChange}
        selectedUserId={null}
        onSelectUser={onSelectUser}
      />,
    );
    expect(screen.getAllByText("Ana Silva").length).toBeGreaterThanOrEqual(1);
    await user.click(screen.getByRole("button", { name: "Próximo" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("omits pagination footer when pagination is null", () => {
    render(
      <CustomersListPanel
        isPending={false}
        isError={false}
        items={[mockUser()]}
        pagination={null}
        onPageChange={onPageChange}
        selectedUserId={null}
        onSelectUser={onSelectUser}
      />,
    );
    expect(screen.queryByRole("button", { name: "Próximo" })).not.toBeInTheDocument();
  });
});
