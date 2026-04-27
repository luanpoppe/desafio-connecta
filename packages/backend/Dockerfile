# syntax=docker/dockerfile:1
# Build from repository root: docker build -f packages/backend/Dockerfile .
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.5 --activate
WORKDIR /repo

FROM base AS build
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/backend packages/backend
RUN pnpm install --frozen-lockfile --filter desafio-connecta-backend...
WORKDIR /repo/packages/backend
# URL fictícia: o `prisma generate` lê o schema (`schema.prisma`) e a config; não conecta à base.
# O `prisma.config.ts` ainda exige `DATABASE_URL` presente. Em runtime, o Compose define a URL real.
ENV DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app"
RUN pnpm exec prisma generate --config prisma/prisma.config.ts
# build:fast evita `tsc --noEmit` no CI/imagem (TS 6+ e baseUrl deprecado).
RUN pnpm run build:fast

FROM base AS prod
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/backend/package.json packages/backend/
RUN pnpm install --frozen-lockfile --filter desafio-connecta-backend... --prod
COPY --from=build /repo/packages/backend/dist packages/backend/dist
COPY --from=build /repo/packages/backend/prisma packages/backend/prisma
COPY packages/backend/docker-entrypoint.sh packages/backend/docker-entrypoint.sh
RUN chmod +x packages/backend/docker-entrypoint.sh
WORKDIR /repo/packages/backend
ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["/repo/packages/backend/docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
