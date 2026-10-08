# Acme Widget Co basket

Proof of concept of the sales basket for Acme Widget Co. A NestJS API prices the basket and a Next.js UI lets you fill it.

> Status: the basket, API and UI work. The README's "How it works" and "Assumptions" sections are still to be written.

## The task

Acme sells three products:

| Product      | Code | Price  |
|--------------|------|--------|
| Red Widget   | R01  | $32.95 |
| Green Widget | G01  | $24.95 |
| Blue Widget  | B01  | $7.95  |

Delivery costs $4.95 for orders under $50 and $2.95 for orders under $90. Orders of $90 or more ship free. The first offer is "buy one red widget, get the second half price".

The basket is created with the catalogue, the delivery rules and the offers. It has an `add` method that takes a product code and a `total` method that returns the cost including delivery and offers.

| Products                | Total  |
|-------------------------|--------|
| B01, G01                | $37.85 |
| R01, R01                | $54.37 |
| R01, G01                | $60.85 |
| B01, B01, R01, R01, R01 | $98.27 |

The deliverable:

- A backend in modern Node/TypeScript that is easy to read.
- A simple React/TypeScript UI. It doesn't need polish, but it can't be ugly.
- A README that explains how it works and what was assumed.
- A public GitHub repo.

## Running it

You need Docker Desktop. `make` is optional; each target is one `docker compose` command.

```bash
make dev     # build and start with hot reload (Ctrl+C to stop)
make up      # or: start in the background
make test    # backend tests + lint, frontend lint + typecheck, inside the containers
make down
```

- UI: http://localhost:3000
- API: http://localhost:8000/healthcheck

To override ports or URLs, copy `.env.example` to `.env`. To run the production images instead, set `BUILD_TARGET=prod`.

Without Docker (Node 24):

```bash
cd backend && pnpm install && pnpm start:dev
cd frontend && pnpm install && pnpm dev
```

## API

All amounts are integer cents.

```bash
curl localhost:8000/products
# {"products":[{"code":"R01","name":"Red Widget","price":3295}, ...]}

curl -X POST localhost:8000/basket/total   -H 'content-type: application/json'   -d '{"items":["R01","R01"]}'
# {"subtotal":6590,"discount":1648,"delivery":495,"total":5437}
```

An unknown product code returns 422. A body that isn't `{ "items": string[] }` returns 400. The server keeps no baskets; see ADR-005.

## Layout

```
backend/    NestJS API: controllers → use-case handlers → domain ← infrastructure
frontend/   Next.js App Router UI: components → hooks → api → httpClient
.claude/    Claude Code skills describing the layer rules for each app
ADR.md      decisions and why
```

`.claude/skills/backend-structure/SKILL.md` and `.claude/skills/frontend-structure/SKILL.md` describe where code goes in each app.

## Assumptions

To be filled in as the basket is built.
