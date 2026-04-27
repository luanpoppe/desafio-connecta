# syntax=docker/dockerfile:1
# Build from repository root: docker build -f packages/frontend/Dockerfile .
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.5 --activate
WORKDIR /repo

FROM base AS build
ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/design-system packages/design-system
COPY packages/frontend packages/frontend
RUN pnpm install --frozen-lockfile --filter desafio-connecta-frontend...
WORKDIR /repo/packages/frontend
# O script prebuild do frontend compila o @connecta/design-system antes do vite build.
RUN pnpm run build

FROM nginx:1.27-alpine AS runner
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/packages/frontend/dist /usr/share/nginx/html
EXPOSE 80
