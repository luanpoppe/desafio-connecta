import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppErrorFallback } from "../AppErrorFallback";

function ThrowingChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("boom");
  return <div>Conteúdo restaurado</div>;
}

function Harness() {
  const [shouldThrow, setShouldThrow] = useState(true);
  return (
    <ErrorBoundary
      FallbackComponent={AppErrorFallback}
      onReset={() => {
        setShouldThrow(false);
      }}
    >
      <ThrowingChild shouldThrow={shouldThrow} />
    </ErrorBoundary>
  );
}

describe("AppErrorFallback com ErrorBoundary", () => {
  const originalError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it("mostra o fallback e recupera após Tentar novamente", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Algo deu errado/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Tentar novamente/i }));

    expect(screen.getByText("Conteúdo restaurado")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
