import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<Badge className="my-badge">L</Badge>);
    const root = container.firstElementChild;
    expect(root).toHaveClass("my-badge");
  });

  it("renders a decorative dot when dot is true", () => {
    const { container } = render(
      <Badge dot variant="success">
        Live
      </Badge>,
    );
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toBeTruthy();
  });
});
