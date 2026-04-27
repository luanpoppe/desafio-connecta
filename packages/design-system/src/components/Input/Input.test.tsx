import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("associates label with the control via htmlFor / id", () => {
    render(<Input label="Email" id="email-field" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("id", "email-field");
  });

  it("derives id from label when id is omitted", () => {
    render(<Input label="Full Name" />);
    expect(screen.getByLabelText("Full Name")).toHaveAttribute("id", "full-name");
  });

  it("shows error text and wires aria-describedby", () => {
    render(<Input label="Code" id="code" error="Invalid code" />);
    expect(screen.getByText("Invalid code")).toBeInTheDocument();
    expect(screen.getByLabelText("Code")).toHaveAttribute("aria-describedby", "code-error");
  });

  it("shows hint when there is no error", () => {
    render(<Input label="Pin" id="pin" hint="4 digits" />);
    expect(screen.getByText("4 digits")).toBeInTheDocument();
    expect(screen.getByLabelText("Pin")).toHaveAttribute("aria-describedby", "pin-hint");
  });

  it("forwards value changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input label="Search" onChange={onChange} />);
    await user.type(screen.getByLabelText("Search"), "hi");
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText("Search")).toHaveValue("hi");
  });
});
