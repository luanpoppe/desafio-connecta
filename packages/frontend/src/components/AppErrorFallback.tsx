import { Button } from "@connecta/design-system";
import { getErrorMessage, type FallbackProps } from "react-error-boundary";

export function AppErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const isDev = process.env.NODE_ENV === "development";
  const message = getErrorMessage(error) ?? "Erro desconhecido.";

  return (
    <div className="flex min-h-dvh flex-col bg-bg" role="alert">
      <header className="border-b border-border/85 bg-gradient-to-b from-accent-subtle/50 via-surface to-surface px-6 py-5">
        <h1 className="text-lg font-[620] tracking-[-0.02em] text-text">
          Algo deu errado
        </h1>
        <p className="mt-1 text-xs font-[420] text-text-muted">
          A interface encontrou um erro inesperado. Pode tentar carregar de novo.
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-lg border border-border/85 bg-surface p-6 text-center shadow-sm">
          <p className="mb-4 text-sm text-text-secondary">
            Se o problema continuar, atualize a página ou contacte o suporte.
          </p>

          {isDev ? (
            <details className="mb-4 rounded-md border border-border/60 bg-bg/80 p-3 text-left text-xs text-text-muted">
              <summary className="cursor-pointer font-[520] text-text-secondary">
                Detalhes técnicos
              </summary>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-mono">
                {message}
              </pre>
            </details>
          ) : null}

          <Button type="button" variant="secondary" size="sm" onClick={resetErrorBoundary}>
            Tentar novamente
          </Button>
        </div>
      </main>
    </div>
  );
}
