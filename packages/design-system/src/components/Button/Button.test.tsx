import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("forwards native button attributes", () => {
    render(<Button type="submit">Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("calls onClick when enabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Tap</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when loading and does not call onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Wait
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges className onto the root element", () => {
    render(
      <Button className="extra-class">X</Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("extra-class");
  });
});
