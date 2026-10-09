# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

Proof of concept of a sales basket for Acme Widget Co, built as a coding test. The basket is created with a product catalogue, delivery charge rules and offers, and has `add(productCode)` and `total()`. The task statement is in `README.md`. `SPEC.md` has the full spec: what the examples imply about rounding and delivery, the gaps in the brief with the call made on each, and what is left to build. Read it before working on the basket. Decisions and their reasons are in `ADR.md`.

One repo, `backend/` and `frontend/` side by side, run with Docker Compose and a Makefile.

## Commands

Everything runs through the `Makefile` (it loads `.env` if present):

- `make dev`: build and start both services with Compose Watch hot reload (foreground).
- `make up` / `make down`: start in the background / stop.
- `make test`: backend typecheck, lint, format check, unit and integration tests, plus frontend lint, typecheck and unit tests, each in a one-off container.
- `make e2e`: Playwright browser tests against the prod images, in their own Compose project.
- `make logs`, `make build`.

Ports: backend 8000 (`GET /healthcheck`, `GET /products`, `POST /basket/total`), frontend 3000.

Without Docker: `pnpm start:dev` in `backend/`, `pnpm dev` in `frontend/`.

Hot reload uses `develop.watch` in `docker-compose.yml`, not bind mounts (see ADR-003). Keep it that way.

Package manager is pnpm only, for security (see ADR-004). It is pinned in each `package.json#packageManager`. Never run `npm`, `npx` or `yarn`, and never add a `package-lock.json`. Use `pnpm exec` or `pnpm dlx` instead of `npx`. Allow a dependency's build script only by adding it to that app's `pnpm-workspace.yaml` under `allowBuilds`, and only after checking what the script does.

## Architecture

- Backend: NestJS 12. Layers are controller → handler → domain ← infrastructure, with DI wiring in Nest modules. Load the `backend-structure` skill before changing `backend/`.
- Frontend: Next.js 16 App Router. Layers are component → hook → api → httpClient. Load the `frontend-structure` skill before changing `frontend/`.

## Git

- Stage files by explicit path. Never `git add -A`, `git add .` or `git commit -a`.
- Check `git status` before every commit and commit only project source, config and docs.
- Files in the working tree that are not part of the project (client documents, personal notes, scratch files) stay untracked. Do not commit them, and do not name them in `.gitignore` either, because that file is public.

## Conventions

- Money is integer cents in the domain. Format to dollars only at the edges.
- Commits follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `build:`, `docs:`, `chore:`), small and one concern each.
- User-facing copy is English.
