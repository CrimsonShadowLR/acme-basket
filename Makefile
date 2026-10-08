.PHONY: help dev up down build logs test backend-test frontend-check

help:
	@echo "Acme Widget Co"
	@echo "--------------"
	@echo "dev             build, start and hot-reload on file changes (foreground)"
	@echo "up              build and start in the background, no hot reload"
	@echo "down            docker compose down"
	@echo "build           docker compose build --no-cache"
	@echo "logs            docker compose logs -f"
	@echo "backend-test    typecheck, lint, format check, unit and e2e tests in a fresh backend container"
	@echo "frontend-check  lint, typecheck and tests in a fresh frontend container"
	@echo "test            backend-test and frontend-check (no running stack needed)"

dev:
	docker compose up --build --watch

up:
	docker compose up -d --build

down:
	docker compose down

build:
	docker compose build --no-cache

logs:
	docker compose logs -f

# A one-off container from the current source, so it works on a fresh clone
# without `make up`. BUILD_TARGET is pinned to dev because the prod images
# have no dev dependencies or tests in them.
backend-test:
	BUILD_TARGET=dev docker compose run --rm --no-deps --build -T backend 		sh -c 'pnpm typecheck && pnpm lint && pnpm format:check && pnpm test && pnpm test:e2e'

frontend-check:
	BUILD_TARGET=dev docker compose run --rm --no-deps --build -T frontend 		sh -c 'pnpm lint && pnpm typecheck && pnpm test'

test: backend-test frontend-check
