-include .env
export

.PHONY: help dev up down build logs test backend-test frontend-check

help:
	@echo "Acme Widget Co"
	@echo "--------------"
	@echo "dev             build, start and hot-reload on file changes (foreground)"
	@echo "up              build and start in the background, no hot reload"
	@echo "down            docker compose down"
	@echo "build           docker compose build --no-cache"
	@echo "logs            docker compose logs -f"
	@echo "backend-test    unit + e2e tests and lint in the backend container"
	@echo "frontend-check  lint and typecheck in the frontend container"
	@echo "test            backend-test and frontend-check"

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

backend-test:
	docker compose exec -T backend pnpm test
	docker compose exec -T backend pnpm test:e2e
	docker compose exec -T backend pnpm lint

frontend-check:
	docker compose exec -T frontend pnpm lint
	docker compose exec -T frontend pnpm typecheck

test: backend-test frontend-check
