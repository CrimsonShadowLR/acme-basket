# Stages: deps -> dev (watch mode, used by docker-compose)
#              -> build -> prod (compiled JS, runtime deps only)
FROM node:24-alpine AS base
WORKDIR /app
# Corepack provides the pnpm version pinned in package.json#packageManager.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
COPY package.json pnpm-lock.yaml ./

FROM base AS deps
RUN pnpm install --frozen-lockfile

FROM deps AS dev
COPY . .
EXPOSE 8000
CMD ["pnpm", "start:dev"]

FROM deps AS build
COPY . .
RUN pnpm build

FROM base AS prod
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod && pnpm store prune
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8000
CMD ["node", "dist/main.js"]
