# Desafio Connecta — Dashboard de Clientes e Transações

Este repositório contém a implementação de um desafio técnico para a Connecta, consistindo em uma plataforma Fullstack que integra dados externos da [DummyJSON](https://dummyjson.com), realiza persistência local e gerencia cache distribuído para alta performance.

O projeto foi desenvolvido com foco em **Clean Architecture**, **Type Safety** e **Escalabilidade**, demonstrando padrões de projeto adequados para ambientes de produção.

---

## 🏗️ Decisões de Arquitetura e Engenharia

Para este nível de desafio, optei por uma abordagem que prioriza a manutenibilidade e a separação de preocupações.

### 🔙 Backend (NestJS + Prisma + Redis)

A estrutura do backend implementa os princípios da **Clean Architecture** e **Ports & Adapters (Arquitetura Hexagonal)**:

- **Entidades de Domínio:** O Core da aplicação utiliza entidades puras (`user.entity.ts`), totalmente desacopladas do ORM.
- **Camada de Aplicação (Use Cases):** Centraliza a lógica de negócio de forma isolada, operando apenas sobre entidades de domínio e interfaces (Ports).
- **Mapeamento de Infraestrutura:** Implementação de **Mappers** específicos (`PrismaUserMapper`) que convertem modelos de persistência em entidades de domínio, garantindo que detalhes do banco de dados não "vazem" para a lógica de negócio.
- **Inversão de Dependência (DI):** Uso de interfaces para definir contratos de repositórios e gateways externos. Isso isola a aplicação de bibliotecas como Axios ou Prisma, facilitando a testabilidade através de mocks.
- **Estratégia de Cache (Pattern Proxy/Decorator):**
  - Para as transações (carts), foi implementado o `CachingExternalCartsGateway`. Ele atua como um *wrapper* sobre o cliente HTTP, injetando lógica de cache sem poluir a lógica de negócio.
  - **O motivo:** APIs externas podem ser instáveis ou lentas. O cache no Redis com TTL configurável garante uma experiência fluida no frontend e reduz o overhead de rede.
- **Sincronização Idempotente:** O módulo de `Sync` utiliza o Redis para garantir que a carga inicial de dados ocorra apenas uma vez no bootstrap da aplicação. A persistência utiliza o `externalId` da DummyJSON como chave de unicidade no PostgreSQL, garantindo que reinicializações ou execuções paralelas não gerem dados duplicados.
- **Validação de Contratos (Zod):** Utilizo o Zod para validar as respostas da API externa logo na "borda" da aplicação. Isso previne erros de runtime caso a API externa mude sua estrutura (Fail Fast).

### 💻 Frontend (React + TanStack Query + Zustand)

No frontend, a prioridade foi o gerenciamento eficiente do estado para garantir uma **Experiência do Usuário (UX)** fluida, aliada a uma alta **Experiência do Desenvolvedor (DX)**:

- **State Management:**
  - **TanStack Query:** Gerencia o *Server State* (cache, revalidação, estados de loading e erro). Isso elimina a necessidade de `useEffect` manuais para busca de dados.
  - **Zustand:** Utilizado para *UI State* global (como a seleção do cliente atual), por ser mais leve e ter menos boilerplate que o Redux.
- **Design System Interno:** Os componentes foram construídos sobre um pacote compartilhado em `@connecta/design-system`, promovendo a consistência visual e reuso de código através do monorepo.
- **Listagens responsivas:** tabelas densas (clientes, transações, produtos do carrinho) usam o `ResponsiveDataTable` do mesmo pacote — em telas estreitas passam a cartões ou linhas empilhadas em vez de depender de scroll horizontal.
- **Tailwind CSS 4:** Utilizado para estilização baseada em utilitários, garantindo um bundle final otimizado e facilidade em lidar com design responsivo.

---

## ⚙️ Configuração (Variáveis de Ambiente)

O projeto utiliza variáveis de ambiente para fácil configuração. Os valores padrão no `docker-compose.yml` são suficientes para execução local, mas podem ser sobrescritos no arquivo `.env`:


| Variável           | Descrição                        | Valor Padrão            |
| ------------------ | -------------------------------- | ----------------------- |
| `BACKEND_PORT`     | Porta de exposição da API        | `3000`                  |
| `FRONTEND_PORT`    | Porta de exposição do Web App    | `8888`                  |
| `DATABASE_URL`     | String de conexão com o Postgres | `postgresql://...`      |
| `REDIS_URL`        | Endereço do servidor Redis       | `redis://redis:6379`    |
| `EXTERNAL_API_URL` | URL base da API DummyJSON        | `https://dummyjson.com` |


---

## 🚀 Como Executar (Ambiente Dockerizado)

A aplicação está totalmente configurada para rodar em containers, simulando um ambiente de deploy real.

### Pré-requisitos

- Docker.

### Inicialização Rápida

```bash
# 1. Preparar variáveis de ambiente
cp .env.example .env

# 2. Subir infraestrutura e aplicações
docker-compose up --build
```

Após o build, a aplicação estará disponível em:

- **Frontend:** [http://localhost:8888](http://localhost:8888)
- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **Documentação (Swagger):** [http://localhost:3000/api](http://localhost:3000/api)

---

## 🛠️ Stack Tecnológica

- **Monorepo:** `pnpm workspaces` para gestão de pacotes.
- **Backend:** NestJS (Node.js), Prisma ORM, PostgreSQL, Redis (IORedis), Zod.
- **Frontend:** React 19, Vite, TanStack Query, Zustand, Tailwind CSS, Axios.
- **Qualidade:** Jest para testes unitários e de integração, ESLint, Prettier.

---

## 🧪 Qualidade e Testes

O projeto foi desenvolvido sob a ótica de testabilidade:

- **Testes Unitários:** Focados nos `UseCases` e `Mappers`, garantindo que a lógica de negócio esteja correta independente da infraestrutura.
- **Execução:**
  ```bash
  # Testes do Backend
  pnpm --filter backend test

  # Testes do Frontend
  pnpm --filter frontend test
  ```

---

## 📂 Organização do Código

```text
.
├── packages
│   ├── backend         # Core da API, Domain Logic e Data Persistence
│   ├── frontend        # Interface de usuário e hooks de consumo de dados
│   └── design-system   # Tokens de design e componentes UI base
├── docker-compose.yml  # Orquestração (App + DB + Cache)
└── pnpm-workspace.yaml # Configuração do Monorepo
```

---

## 📝 Observações Adicionais

- **Segurança de Tipos:** O TypeScript é utilizado em modo estrito em todo o projeto, garantindo que o contrato entre Backend e Frontend seja respeitado através de definições de DTOs e Types.
- **Tratamento de Erros:** Implementada uma camada de interceptadores no NestJS e Error Boundaries no React para garantir que falhas sejam tratadas de forma graciosa.

---

*Desenvolvido com foco em excelência técnica por Luan Poppe.*