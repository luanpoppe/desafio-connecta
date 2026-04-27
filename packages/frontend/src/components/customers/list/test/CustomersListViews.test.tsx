import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockUser } from "../../../../test/fixtures/users";
import { CustomerListRow, CustomersListTable } from "../CustomersListViews";

describe("CustomerListRow", () => {
  it("calls onSelect with user id on click", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const u = mockUser({ id: 77 });
    render(<table><tbody><CustomerListRow user={u} selected={false} onSelect={onSelect} /></tbody></table>);
    await user.click(screen.getByRole("row"));
    expect(onSelect).toHaveBeenCalledWith(77);
  });

  it("calls onSelect on Enter and Space", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const u = mockUser({ id: 3 });
    render(<table><tbody><CustomerListRow user={u} selected={false} onSelect={onSelect} /></tbody></table>);
    const row = screen.getByRole("row");
    row.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenNthCalledWith(1, 3);
    expect(onSelect).toHaveBeenNthCalledWith(2, 3);
  });

  it("marks row as selected when selected is true", () => {
    const u = mockUser();
    render(<table><tbody><CustomerListRow user={u} selected onSelect={jest.fn()} /></tbody></table>);
    expect(screen.getByRole("row")).toHaveAttribute("aria-selected", "true");
  });

  it("trims composed name", () => {
    const u = mockUser({ firstName: " Jo", lastName: "Na " });
    render(<table><tbody><CustomerListRow user={u} selected={false} onSelect={jest.fn()} /></tbody></table>);
    expect(screen.getAllByText("Jo Na").length).toBeGreaterThanOrEqual(1);
  });
});

describe("CustomersListTable", () => {
  it("passes selection state per row", () => {
    const items = [mockUser({ id: 1 }), mockUser({ id: 2 })];
    render(
      <CustomersListTable items={items} selectedUserId={2} onSelectUser={jest.fn()} />,
    );
    const rows = screen.getAllByRole("row").filter((r) => r.querySelector("td"));
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveAttribute("aria-selected", "false");
    expect(rows[1]).toHaveAttribute("aria-selected", "true");
  });
});
