# Browsers and their system libraries come with the image. Its tag must match
# the @playwright/test version in package.json.
FROM mcr.microsoft.com/playwright:v1.63.0-noble
WORKDIR /e2e
# Corepack provides the pnpm version pinned in package.json#packageManager.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    CI=1
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
CMD ["pnpm", "test"]
