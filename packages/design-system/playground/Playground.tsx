import React from "react";
import {
  Avatar, Badge, Button, Divider, EmptyState,
  Input, Pagination, Panel, PanelBody, PanelFooter, PanelHeader,
  Skeleton, SkeletonRow, SkeletonTable, Spinner,
  SummaryStrip, Table, TableBody, TableHead, TableRow,
  TableTd, TableTh, Tag,
} from "../src/index";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-[700] uppercase tracking-[0.12em] text-text-muted">
          {title}
        </span>
        <span className="flex-1 h-px bg-border" />
      </div>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  );
}

const USERS = [
  { id: 1, name: "Ana Souza",    email: "ana@connecta.io",   role: "admin", carts: 42, img: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Bruno Lima",   email: "bruno@connecta.io", role: "user",  carts: 17, img: null },
  { id: 3, name: "Carla Mendes", email: "carla@connecta.io", role: "user",  carts: 28, img: "https://i.pravatar.cc/40?img=3" },
  { id: 4, name: "Diego Costa",  email: "diego@connecta.io", role: "user",  carts: 9,  img: "https://i.pravatar.cc/40?img=12" },
];

export function Playground() {
  const [page, setPage]   = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<number | null>(1);

  return (
    <div className="min-h-screen bg-bg font-sans">

      {/* Topbar */}
      <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur-sm px-8 py-0">
        <div className="max-w-5xl mx-auto h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-accent flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" fillOpacity=".9"/>
                <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" fillOpacity=".6"/>
                <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" fillOpacity=".6"/>
                <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" fillOpacity=".9"/>
              </svg>
            </div>
            <span className="text-sm font-[650] tracking-[-0.02em] text-text">Connecta UI</span>
            <Badge variant="accent" size="sm">v0.1.0</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Documentação</Button>
            <Button size="sm">Começar</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-border bg-surface px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-[600] tracking-[0.10em] uppercase text-accent mb-3">Design System</p>
          <h1 className="text-4xl font-[700] tracking-[-0.04em] text-text mb-2">
            Componentes e tokens
          </h1>
          <p className="text-base text-text-secondary font-[420] max-w-md">
            Biblioteca de UI para o produto Connecta — construída com React, Tailwind v4 e CVA.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12 flex flex-col gap-16">

        {/* Buttons */}
        <Section title="Button">
          <div className="flex flex-col gap-5 w-full">
            <div>
              <p className="text-[11px] text-text-muted mb-3 font-[500]">Variantes</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button variant="primary">Primário</Button>
                <Button variant="secondary">Secundário</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-text-muted mb-3 font-[500]">Tamanhos</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-text-muted mb-3 font-[500]">Com ícone e estados</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button icon={<PlusIcon />}>Novo cliente</Button>
                <Button variant="secondary" icon={<FilterIcon />} iconPosition="right">Filtros</Button>
                <Button loading>Salvando</Button>
                <Button disabled>Desabilitado</Button>
                <Button variant="danger" icon={<TrashIcon />}>Excluir</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Badges */}
        <Section title="Badge">
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">padrão</Badge>
              <Badge variant="accent">accent</Badge>
              <Badge variant="success" dot>Ativo</Badge>
              <Badge variant="warning" dot>Pendente</Badge>
              <Badge variant="error" dot>Bloqueado</Badge>
              <Badge variant="info">informação</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent" size="sm">admin</Badge>
              <Badge variant="success" size="sm" dot>online</Badge>
              <Badge variant="warning" size="sm">rascunho</Badge>
            </div>
          </div>
        </Section>

        {/* Avatars */}
        <Section title="Avatar">
          <div className="flex items-end gap-3">
            <Avatar name="Ana Souza" src="https://i.pravatar.cc/40?img=1" size="xs" />
            <Avatar name="Ana Souza" src="https://i.pravatar.cc/40?img=1" size="sm" />
            <Avatar name="Ana Souza" src="https://i.pravatar.cc/40?img=1" size="md" />
            <Avatar name="Ana Souza" src="https://i.pravatar.cc/40?img=1" size="lg" />
          </div>
          <div className="flex items-end gap-3">
            <Avatar name="Bruno Lima"   src={null} size="xs" />
            <Avatar name="Carla Mendes" src={null} size="sm" />
            <Avatar name="Diego Costa"  src={null} size="md" />
            <Avatar name="Eva Ribeiro"  src={null} size="lg" />
          </div>
        </Section>

        {/* Inputs */}
        <Section title="Input">
          <div className="grid grid-cols-3 gap-4 w-full">
            <Input
              label="Buscar cliente"
              placeholder="Nome ou e-mail"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              leadingIcon={<SearchIcon />}
            />
            <Input label="Com erro" placeholder="email@exemplo.com" error="E-mail inválido" />
            <Input label="Com dica" placeholder="Digite algo" hint="Máximo 100 caracteres" />
          </div>
        </Section>

        {/* Tags + Spinners */}
        <Section title="Tag / Spinner">
          <Tag>React</Tag>
          <Tag>TypeScript</Tag>
          <Tag onRemove={() => {}}>Removível</Tag>
          <Divider orientation="vertical" className="h-6" />
          <div className="flex items-center gap-3">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </Section>

        {/* Summary */}
        <Section title="SummaryStrip">
          <SummaryStrip
            items={[
              { label: "Total de carrinhos", value: "47",        subValue: "deste cliente" },
              { label: "Valor total",        value: "R$ 12.840", subValue: "sem descontos" },
              { label: "Itens únicos",       value: "183" },
              { label: "Média / carrinho",   value: "R$ 273" },
            ]}
          />
        </Section>

        {/* Panel + Table */}
        <Section title="Panel + Table">
          <div className="w-full">
            <Panel>
              <PanelHeader
                title="Clientes"
                description="Lista de todos os clientes cadastrados"
                action={
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Buscar..."
                      leadingIcon={<SearchIcon />}
                      size="sm"
                      className="w-44"
                    />
                    <Button size="sm" variant="secondary" icon={<FilterIcon />}>Filtros</Button>
                    <Button size="sm" icon={<PlusIcon />}>Novo</Button>
                  </div>
                }
              />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableTh>Cliente</TableTh>
                    <TableTh>E-mail</TableTh>
                    <TableTh>Perfil</TableTh>
                    <TableTh align="right">Carrinhos</TableTh>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {USERS.map((u) => (
                    <TableRow
                      key={u.id}
                      interactive
                      selected={selected === u.id}
                      onClick={() => setSelected(u.id)}
                    >
                      <TableTd>
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} src={u.img} size="sm" />
                          <div>
                            <p className="font-[530] text-text">{u.name}</p>
                          </div>
                        </div>
                      </TableTd>
                      <TableTd muted>{u.email}</TableTd>
                      <TableTd>
                        <Badge variant={u.role === "admin" ? "accent" : "default"}>
                          {u.role}
                        </Badge>
                      </TableTd>
                      <TableTd align="right" muted>{u.carts}</TableTd>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <PanelFooter>
                <Pagination page={page} pageSize={10} total={47} onPageChange={setPage} />
              </PanelFooter>
            </Panel>
          </div>
        </Section>

        {/* Skeleton */}
        <Section title="Skeleton">
          <div className="w-full border border-border rounded-[var(--radius-xl)] overflow-hidden">
            <SkeletonTable rows={3} cols={4} />
          </div>
        </Section>

        {/* Empty state */}
        <Section title="EmptyState">
          <div className="w-full border border-border rounded-[var(--radius-xl)]">
            <EmptyState
              icon={<InboxIcon />}
              title="Nenhum resultado encontrado"
              description="Tente ajustar os filtros ou buscar por outro termo."
              action={<Button variant="secondary" size="sm">Limpar filtros</Button>}
            />
          </div>
        </Section>

        <Divider />
        <p className="text-xs text-text-muted text-center pb-8 font-[420]">
          Connecta Design System · v0.1.0 · MIT
        </p>

      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2 3.5h10M5.5 3.5v-1.5h3v1.5M5 3.5l.5 7M9 3.5l-.5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22 12h-6l-2 3H10l-2-3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
