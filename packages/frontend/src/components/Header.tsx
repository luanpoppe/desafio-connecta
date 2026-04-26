export function Header() {
  return (
    <header className="border-b border-border bg-surface px-6 py-5">
      <h1 className="text-lg font-[620] tracking-[-0.02em] text-text">
        Clientes e transações
      </h1>
      <p className="text-xs text-text-muted mt-1 font-[420]">
        Selecione um cliente para ver os carrinhos e o resumo.
      </p>
    </header>
  );
}
