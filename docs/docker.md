# Docker e stack (frontend + backend) — notas

Documento único em **português do Brasil** com decisões e dúvidas sobre **Dockerfile**, **Compose**, **Nginx**, **Corepack**, **Vite/ARG**, **design-system**, **Prisma** e tópicos relacionados. Novas entradas podem ser acrescentadas no [Histórico de dúvidas](#histórico-de-dúvidas).

## Índice

1. [Parte 1 — Frontend (Docker, Nginx, Vite)](#parte-1--frontend-docker-nginx-vite)  
2. [Parte 2 — Backend (Prisma, `package.json`, Docker)](#parte-2--backend-prisma-packagejson-docker)  
3. [ENTRYPOINT, `CMD` e `exec "$@"` (como o Docker compõe o comando)](#entrypoint-cmd-e-exec--como-o-docker-compõe-o-comando)  
4. [Histórico de dúvidas](#histórico-de-dúvidas)

---

## Parte 1 — Frontend (Docker, Nginx, Vite)

### Corepack no `Dockerfile` (estágio `base`)

Comando (`packages/frontend/Dockerfile`):

```dockerfile
RUN corepack enable && corepack prepare pnpm@9.15.5 --activate
```

- **`corepack enable`:** o Corepack acompanha o Node e serve para **gerir executáveis** de pnpm e Yarn, sem instalar pnpm com `npm i -g pnpm`.
- **`corepack prepare pnpm@9.15.5 --activate`:** **prepara** o binário do **pnpm 9.15.5** (alinhado ao `lockfileVersion: 9`) e o **`--activate`** faz o `pnpm` do `PATH` usar **essa** versão.
- **`&&`:** o segundo comando só corre se o primeiro terminar com sucesso.

**Resumo:** pnpm com versão fixa e alinhada ao lockfile, de forma reprodutível.

---

### Nginx no contêiner: é obrigatório?

**Não.** Não é requisito do Docker; é **uma** forma de servir o `vite build` (`dist/`).

- Em algum lugar é preciso um **servidor HTTP** para ficheiros estáticos.
- A imagem `nginx:1.27-alpine` costuma ser usada em produção: **leve** e comum para sites estáticos.
- `packages/frontend/nginx.conf` define **fallback de SPA** (`try_files` → `index.html`) e **`/health`**.

**Alternativas:** `vite preview --host 0.0.0.0 --port 4173`, `npx serve -s dist`, Caddy, `httpd`, etc.

A escolha costuma ser **operacional** (tamanho da imagem, produção vs preview), não outro tipo de build do Vite.

---

### Nginx e `vite preview` — comparação rápida

| Aspeto            | Nginx (`nginx:alpine`)                                 | `vite preview --host 0.0.0.0 --port 4173`             |
| ----------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| **Runtime**       | C (Nginx)                                                | Node + Vite (preview)                                 |
| **Imagem final**  | Em geral **mais leve** (sem Node no estágio final)        | Em geral **maior**                                   |
| **Cenário típico** | Produção / estático                                    | Pré-visualização, stacks “só Node”                   |
| **Config**        | Explícita (`nginx.conf`)                                 | Comportamento do `preview` + docs do Vite            |

O **browser** recebe o **mesmo** `dist` na prática; muda quem **serve** e o **tamanho** do contêiner.

---

### Configuração resumida (`packages/frontend/nginx.conf`)

- `root` em `/usr/share/nginx/html` (cópia do `dist` do Vite).
- `location /` com `try_files $uri $uri/ /index.html` — **SPA**.
- `location /health` — resposta `200` em texto (health check).

---

### `ARG` e `ENV` do `VITE_API_BASE_URL` (linhas 8–9 do `Dockerfile`)

```dockerfile
ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
```

- **`ARG`:** argumento de build com padrão; pode ser trocado com `docker build --build-arg` ou com `build.args` no Compose (URL da API no **host** onde o browser corre).
- **`ENV`:** repete o valor para o `RUN` seguinte; o Vite **injeta** `VITE_*` no bundle.

**Nota:** variáveis `VITE_*` ficam, em geral, **fixas no build**. Mudar a URL no runtime do Nginx **não** muda o JS; em regra é preciso **reconstruir** a imagem do frontend (ou outro padrão, ex. `config.js` no start).

#### Como o Docker Compose passa o valor ao `ARG`

```yaml
build:
  context: .
  dockerfile: packages/frontend/Dockerfile
  args:
    VITE_API_BASE_URL: http://localhost:${BACKEND_PORT:-3000}
```

1. Cada chave de `args` mapeia para o `ARG` de **igual** nome (equivale a `docker build --build-arg ...`).
2. `${BACKEND_PORT:-3000}` é resolvida **no host** (env + `.env` do Compose) **antes** do build.
3. Equivalente manual, por exemplo: `docker build -f packages/frontend/Dockerfile --build-arg VITE_API_BASE_URL=http://localhost:3000 .`
4. Se alterares o `arg` / porta, em geral é preciso **rebuild** do frontend; só recriar o contêiner com imagem antiga **não** altera o bundle.

---

### Estágio `runner` (Nginx) — falta `CMD`?

A imagem **`nginx:1.27-alpine`** já define `CMD` (Nginx em foreground, `daemon off;`). Não é obrigatório repetir no `Dockerfile`.

- `COPY` do `nginx.conf` e do `dist` preenche config e ficheiros estáticos.
- `EXPOSE 80` **documenta** a porta; a publicação no host é com `-p` / `ports:`.

---

### Build do `@connecta/design-system` no Docker

O `Dockerfile` não precisa de um `RUN` separado: o `packages/frontend/package.json` define **`prebuild`**, que chama `pnpm --filter @connecta/design-system run build` **antes** de `build` (Vite), no mesmo `RUN pnpm run build`.

- `COPY packages/design-system` e `pnpm install --filter desafio-connecta-frontend...` dão o **contexto** e dependências de workspace.
- Há **comentário** no `Dockerfile` a lembrar o `prebuild` antes de `RUN pnpm run build`.

---

## Parte 2 — Backend (Prisma, `package.json`, Docker)

### `prisma:deploy`: `prisma migrate deploy` (e não `prisma db deploy`)

No **Prisma 7.8**, o fluxo certo para aplicar migrações de pasta em **produção** é **`prisma migrate deploy`**, com suporte a **`--config prisma/prisma.config.ts`**. O `prisma db` expõe outros subcomandos, não o deploy de migrações neste sentido.

O *script* `prisma:deploy` e o *entrypoint* usam `migrate deploy` para evitar falha no contêiner (o comando antigo errado mostrava *help* e saía com erro).

---

### `prisma` em `dependencies`

A imagem final do backend usa **`pnpm install --prod`**, que **não** instala `devDependencies`. O **`docker-entrypoint.sh`** chama o CLI do Prisma para migrar **antes** de `node dist/main.js`, e o `prisma.config.ts` importa de **`prisma/config`**. Sem o pacote `prisma` no `node_modules` de produção, falha. Por isso `prisma@7.8.0` está em **`dependencies`**, não só em dev.

**Resumo:** alinhamento ao **CLI** do Prisma 7; dependência **necessária** a migrações e à config no Docker de produção.

---

### `DATABASE_URL` no *build* do `Dockerfile` do backend (valor fictício)

No estágio `build`, o `prisma generate` **não conecta** a um PostgreSQL. Lê o **`schema.prisma`** (e a config) para gerar o cliente. O `prisma.config.ts` continua a exigir a variável **`DATABASE_URL` definida**, daí a linha com uma **URL de exemplo**; pode ser **fictícia**. A URL **real** na execução vem do `docker-compose` (`services.backend.environment`), não desta `ENV` do *build*.

---

### `docker-entrypoint.sh` em vez de tudo no `Dockerfile`?

O `ENTRYPOINT` / `CMD` do Docker podem, em muitos casos, levar a mesma lógica **numa linha** com `sh -c '...'`. **Dá** para fazer, por exemplo:

- `ENTRYPOINT ["/bin/sh", "-c", "… comando longo com migrate e exec node …"]`

Neste repositório usamos um **script** à parte por:

- **Ler o fluxo** — `set -e`, o `if` de `SKIP_DB_MIGRATE`, o subshell `(cd ... && pnpm exec prisma ...)` e o `exec "$@"` ficam claros; na mesma instrução *inline* o escape de aspas e a legibilidade pioram muito.
- **PID 1 e sinais** — o `exec` no fim repassa o **processo principal** (`node`) como PID 1, o que ajuda a receber `SIGTERM` (paragem graciosa do contêiner). Um `sh -c` muito aninhado pode complicar esse repasse.
- **Manutenção** — editar o `.sh` é mais simples do que mexer numa *string* gigante no `Dockerfile`.

**Resumo:** **não é** obrigatório ter ficheiro à parte; é **preferência** de clareza e de encaixe com o `CMD ["node", "dist/main.js"]` que o entrypoint consome com `exec "$@"`.

---

### `chmod +x` no `docker-entrypoint.sh` (`packages/backend/Dockerfile`)

```dockerfile
COPY packages/backend/docker-entrypoint.sh packages/backend/docker-entrypoint.sh
RUN chmod +x packages/backend/docker-entrypoint.sh
```

- **`+x`:** ativa a **permissão de execução** (bit *execute*) do ficheiro, no modelo típico do Unix (`chmod ugo+x` implícito em `+x` conforme o umask; aqui aplica-se ao ficheiro copiado).
- **Porquê:** no Linux, para ser **caminho direto** do `ENTRYPOINT ["/repo/.../docker-entrypoint.sh"]`, o ficheiro deve poder ser **executado**; sem `+x`, podes obter *Permission denied* (consoante o uso exacto *exec* vs. passar a `/bin/sh`).
- **`COPY`:** a cópia do contexto de build **nem sempre** mantém o mesmo modo de ficheiro que no *host* (e no Windows a noção de “executável” difere), por isso **`RUN chmod +x`** deixa o comportamento **previsível** no estágio `prod` da imagem.

---

### Linha a linha: `docker-entrypoint.sh`

```sh
#!/bin/sh
set -e
if [ "${SKIP_DB_MIGRATE:-0}" != "1" ]; then
  (cd /repo/packages/backend && pnpm exec prisma migrate deploy --config prisma/prisma.config.ts)
fi
cd /repo/packages/backend
exec "$@"
```

| Linha | O quê / porquê |
|-------|----------------|
| `#!/bin/sh` | *Shebang*: indica que o ficheiro deve ser executado com **`/bin/sh`** (shell do Alpine, em geral *ash* compatível com POSIX), em vez de forçar `bash`. O Docker, ao correr o script, usa este intérprete. |
| `set -e` | Se **qualquer** comando falhar (código de saída ≠ 0), o *script* **termina de imediato** em erro. Assim, se o `prisma migrate deploy` falhar, o Node **não** chega a arrancar (evita servir a API com a base desatualizada). |
| `if [ "${SKIP_DB_MIGRATE:-0}" != "1" ]; then` | **Condição:** lê a variável de ambiente `SKIP_DB_MIGRATE`. O `${VAR:-0}` significa: se `SKIP_DB_MIGRATE` **não existir** ou for vazia, usa o texto **`0`**. Só se o valor for **diferente de** `1` é que se executa o bloco seguinte. Ou seja, podes pular as migrações (por exemplo com `SKIP_DB_MIGRATE=1` no Compose) quando precisares (debug raro, ou fluxo muito controlado). |
| `(cd /repo/.../backend && pnpm exec prisma migrate deploy --config ...)` | **Parêntesis `(...)`** = o `cd` e o `pnpm` correm num **subshell** (processo filho). O `cd` vale **só** para esse comando: o diretório de trabalho do *script* principal **não** fica “preso” nessa pasta ainda. O `&&` exige: primeiro `cd` com sucesso, depois o `pnpm exec prisma ...`.<br><br>• **`migrate deploy`:** aplica migrações pendentes na base **com a `DATABASE_URL` de runtime** (a que o Docker injeta).<br>• **`--config prisma/prisma.config.ts`:** indica o ficheiro de config do Prisma 7 (datasource, caminho das migrações, etc.). |
| `fi` | Fecha o `if`. |
| `cd /repo/packages/backend` | A partir daqui, o *shell* do entrypoint fica com o **diretório atual** na raiz do pacote backend, para o próximo passo. |
| `exec "$@"` | **`exec`** substitui o processo do *shell* pelo programa que vais correr, **sem** deixar um *shell* extra no meio. **`"$@"`** são **todos** os argumentos passados ao *script* pelo processo que o arrancou (o Docker, após juntar `CMD` a `ENTRYPOINT` — vê a secção seguinte). Efeito típico: `exec node dist/main.js` com o *cwd* em `/repo/packages/backend` e o `node` como PID 1. |

**Detalhe sobre `ENTRYPOINT` + `CMD` + `"$@"`:** secção [ENTRYPOINT, `CMD` e `exec "$@"`](#entrypoint-cmd-e-exec--como-o-docker-compõe-o-comando) (mais abaixo).

---

### ENTRYPOINT, `CMD` e `exec "$@"` (como o Docker compõe o comando)

No `packages/backend/Dockerfile` (final do ficheiro):

```dockerfile
ENTRYPOINT ["/repo/packages/backend/docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
```

- As duas linhas **não** são executadas em sequência por um *shell* no `Dockerfile`. Ficam gravadas na **imagem** como metadados: *entrypoint* predefinido e *default command* (argumentos predefinidos desse *entrypoint*).
- No **arranque do contêiner**, o runtime (Docker / containerd) **monta o `argv`** do processo inicial assim:  
  **[ `/repo/packages/backend/docker-entrypoint.sh`, `node`, `dist/main.js` ]**  
  Ou seja, o *script* é `argv[0]` em termos de *execução* do ficheiro; e `node`, `dist/main.js` passam a ser **argumentos** desse *script* (`$1`, `$2` no *shell*, e `"$@"` os dois juntos).
- O **CMD** (em forma *JSON*) neste padrão **não** é um segundo processo: são **argumentos por omissão** para o *entrypoint* quando o `docker run` **não** passa outra lista. Se fizeres `docker run ... imagem` sem comando extra, usa-se o `CMD` da imagem.
- Se fizeres `docker run ... imagem arg1 arg2`, em geral **substitui-se** o `CMD` da imagem por `arg1 arg2` (mantendo o *entrypoint*), salvo se usares `--entrypoint` para o alterar. Consulta a documentação do `docker run` para o teu caso exacto.
- O `exec "$@"` no *script* expande portanto para `exec node dist/main.js` (ver a linha `exec "$@"` na tabela da secção **Linha a linha: `docker-entrypoint.sh`**, mais acima).

**Resumo:** `"$@"` sabe o que executar porque o **Docker** injecta, no *start*, os argumentos do **CMD** para o *script* do **ENTRYPOINT**; não é o *script* a ir buscar a “linha de baixo” do `Dockerfile`.

---

## Histórico de dúvidas

### 2026-04-26

- **`ARG` / `ENV` e `VITE_API_BASE_URL`:** `ARG` pode ser passado via Compose; `ENV` leva o valor ao `pnpm run build` / Vite; URL no cliente em geral fica no build — rebuild se mudar.
- **Nginx — falta `CMD`?** Não, a base `nginx:1.27-alpine` já define; `EXPOSE` não publica host sozinho.

### 2026-04-27

- **Compose e `build.args`:** mapeia para `ARG`; `${BACKEND_PORT}` é resolvida no host antes do build; imagem com valor “congelado”.
- **Design-system no Docker:** compila no `prebuild` do frontend, não com `RUN` extra no `Dockerfile` (há comentário no ficheiro).
- **Backend — `prisma:deploy` e `prisma` em `dependencies`:** `migrate deploy` no Prisma 7.8; `prisma` em prod para o entrypoint e `prisma/config`.

### 2026-04-28

- **Backend — `ENV DATABASE_URL` no *build*:** manter **URL fictícia** no `Dockerfile` (só `prisma generate` + leitura do `schema.prisma`); *runtime* continua a vir do Compose. Removidos `ARG`/`build.args` e variável extra no `.env` (volta a ser simples).

### 2026-04-29

- **Backend — `docker-entrypoint.sh`:** dá para colocar tudo com `sh -c` no `Dockerfile`, mas o script fica **mais legível** e o `exec "$@"` alinha o **PID 1** com o `node`; explicado em `docs/docker.md`.

### 2026-04-30

- **Backend — `docker-entrypoint.sh` linha a linha:** `#!/bin/sh`, `set -e`, `SKIP_DB_MIGRATE`, subshell com `migrate deploy`, `cd` final, `exec "$@"` com o `CMD`; ver tabela em `docs/docker.md`.
- **`ENTRYPOINT` + `CMD` e o `"$@"`:** o Docker **compõe** os argumentos no *start* do contêiner; o `CMD` vira os args do *script* de entrypoint, não “linha de baixo” lida pelo *shell* — secção alargada e índice actualizado.

### 2026-05-01

- **Backend — `RUN chmod +x` no `Dockerfile`:** permissão de **execução** no `docker-entrypoint.sh` após o `COPY`; explicado em `docs/docker.md` (secção *chmod +x*).
