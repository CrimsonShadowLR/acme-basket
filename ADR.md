# Architecture decision records

Short records of the decisions that shape this repo. Newest last.

---

## ADR-001: One repo, two independent apps

**Status:** accepted

**Context.** The test asks for a Node/TypeScript backend and a React/TypeScript UI, delivered in one public repo that a reviewer can clone and run.

**Decision.** Keep `backend/` and `frontend/` side by side in one repo, each with its own dependencies and Dockerfile, run together with Docker Compose and a Makefile. No pnpm workspace and no shared package.

**Consequences.** Each app installs, builds and tests on its own. The few request/response types the UI needs are declared again in the frontend. If the API grows, a `contracts/` workspace package would remove that duplication; it is not worth the extra Docker wiring for a handful of types.

---

## ADR-002: NestJS for the backend, Next.js for the frontend

**Status:** accepted

**Context.** The catalogue, the delivery rules and the offers are passed into the basket, and Acme is still experimenting with offers. Each rule should be swappable without touching the code that combines them.

**Decision.** NestJS 12 for the API and Next.js 16 (App Router) for the UI.

**Consequences.** Nest has a DI container, so binding an `Offer` or `DeliveryRule` interface to a concrete class happens in one module file and the domain stays plain TypeScript. Nest modules give each feature one place for that wiring (controller → handler → domain). Next gives routing, a production server and Tailwind with no extra setup. The UI is small, so most of it runs as client components that call the API through React Query.

---

## ADR-003: Compose Watch instead of bind mounts for hot reload

**Status:** accepted

**Context.** The repo lives on a removable exFAT drive (`D:`). Docker Desktop's Linux VM does not mount that drive, so every bind mount from it shows up as an empty directory in the container. The first attempt mounted `backend/src`; the container saw no source files and Nest failed with `Cannot find module '/app/dist/main'`.

**Decision.** Drop bind mounts. Use `develop.watch` in `docker-compose.yml` with `sync` actions for `src/` (and `test/`, `public/`) and a `rebuild` action for `package.json`. `make dev` runs `docker compose up --build --watch`.

**Consequences.** Hot reload works on any drive and any OS, and file watchers inside the container get native events, so no polling variables are needed. Changes made inside the container do not flow back to the host. That is fine because nothing writes source code there.

**Update.** The repo has since moved to the main NTFS disk, where bind mounts would work. Compose Watch stays. It already works, it does not depend on which drive the repo is on, and it keeps the host `node_modules` (Windows binaries) out of the Linux container.

---

## ADR-004: pnpm as the package manager

**Status:** accepted

**Context.** The apps started on npm. npm runs every dependency's install scripts by default, and its flat `node_modules` lets code import packages it never declared. Both make a compromised or typo-squatted package more dangerous.

**Decision.** Use pnpm, and only pnpm, in both apps. pnpm does not run dependency build scripts unless the package is listed in `allowBuilds`, and its `node_modules` only exposes declared dependencies. It is pinned through `packageManager` in each `package.json`. Docker images get it through Corepack, and CI through `pnpm/action-setup`, so everyone runs the same version. Each app keeps its own `pnpm-lock.yaml`, in line with ADR-001.

**Consequences.** `pnpm install --frozen-lockfile` fails when a lockfile is out of date, in CI and in Docker. A dependency that really needs its build script goes in that app's `pnpm-workspace.yaml` under `allowBuilds`, after someone has read the script.
