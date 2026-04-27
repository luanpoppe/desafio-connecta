import { lazy, Suspense } from "react";
import { Spinner } from "@connecta/design-system";

const CustomersPage = lazy(() =>
  import("./pages/CustomersPage").then((m) => ({ default: m.CustomersPage })),
);

function AppShellFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <Spinner />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<AppShellFallback />}>
      <CustomersPage />
    </Suspense>
  );
}

export default App;
