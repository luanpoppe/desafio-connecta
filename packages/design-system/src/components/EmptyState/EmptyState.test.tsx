import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title and optional description", () => {
    render(
      <EmptyState
        title="Nothing here"
        description="Try adding an item."
      />,
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("Try adding an item.")).toBeInTheDocument();
  });

  it("renders icon and action slots", () => {
    render(
      <EmptyState
        title="No rows"
        icon={<span data-testid="ico">I</span>}
        action={<button type="button">Create</button>}
      />,
    );
    expect(screen.getByTestId("ico")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });
});
