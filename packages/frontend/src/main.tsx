import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import "./index.css";
import App from "./App.tsx";
import { AppErrorFallback } from "./components/AppErrorFallback.tsx";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

export function Root() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <ErrorBoundary
          FallbackComponent={AppErrorFallback}
          onError={(error, info) => {
            console.error("React error boundary:", error, info.componentStack);
          }}
        >
          <App />
        </ErrorBoundary>
      </QueryClientProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
