# Acme Widget Co basket

Proof of concept of the sales basket for Acme Widget Co. A NestJS API prices the basket and a Next.js UI lets you fill it.

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
- API: http://localhost:8000

To override ports or URLs, copy `.env.example` to `.env`. To run the production images instead, set `BUILD_TARGET=prod`.

Without Docker you need Node 24 and pnpm. `corepack enable` installs the pnpm version pinned in each `package.json`.

```bash
cd backend && pnpm install && pnpm start:dev
cd frontend && pnpm install && pnpm dev
```

## How it works

The pricing rules are plain TypeScript in [`backend/src/domain/`](backend/src/domain). Nothing in that folder imports NestJS, so it reads and tests on its own.

```ts
const basket = new Basket(catalogue, delivery, offers);
basket.add('R01');
basket.add('R01');
basket.total(); // 5437 (cents)
```

- [`Catalogue`](backend/src/domain/catalogue/catalogue.ts) looks up products by code and throws `UnknownProductError` for anything else.
- [`DeliveryRule`](backend/src/domain/delivery/delivery-rule.ts) is an interface. [`TieredDelivery`](backend/src/domain/delivery/tiered-delivery.ts) implements it from a list of `{ from, charge }` tiers, and the highest tier the subtotal reaches wins.
- [`Offer`](backend/src/domain/offers/offer.ts) is an interface that returns a discount for the basket's items. [`BuyOneGetSecondHalfPrice`](backend/src/domain/offers/buy-one-get-second-half-price.ts) is the red widget offer.
- [`Basket`](backend/src/domain/basket/basket.ts) adds up the prices, subtracts the offers' discounts, then charges delivery on what is left.

The Acme products, delivery tiers and offer are data in [`backend/src/infrastructure/acme-pricing.ts`](backend/src/infrastructure/acme-pricing.ts). A new offer is a new class that implements `Offer`, added to that list. Nest modules pass these into the handler, and nothing else names them.

Money is integer cents everywhere in the backend and in the API. The UI turns cents into dollars in one function, `frontend/src/shared/formatMoney.ts`.

### API

The API keeps no baskets. The UI holds the list of codes and sends the whole list each time it changes. The handler builds a `Basket`, calls `add` for each code and returns the breakdown. ADR-005 explains why.

```bash
curl localhost:8000/products
# {"products":[{"code":"R01","name":"Red Widget","price":3295}, ...]}

curl -X POST localhost:8000/basket/total \
  -H 'content-type: application/json' \
  -d '{"items":["R01","R01"]}'
# {"subtotal":6590,"discount":1648,"delivery":495,"total":5437}
```

An unknown product code returns 422 with the code. A body that isn't `{ "items": string[] }`, or holds more than 1000 codes, returns 400.

### UI

One page, with products on the left and the basket on the right (stacked on a phone). Each basket line has −/+ and Remove, and the panel shows subtotal, offers, delivery and total as the API returns them. The UI has no pricing logic.

### Tests

```bash
cd backend
pnpm test       # domain and handler unit tests
pnpm test:e2e   # the API over HTTP
```

The four example baskets from the brief are tests in both suites. The unit tests also cover the $50 and $90 boundaries, four reds, an empty basket, several offers at once and unknown codes.

## Assumptions

The brief leaves these open. The example totals settle the first two. The rest are my calls, and each is a small change if Acme wants it otherwise.

- **Delivery is charged on the subtotal after offers.** R01, R01 is $65.90 before the offer and $49.42 after. Only the second gives the expected $54.37.
- **The half-price item rounds down to the cent.** Half of $32.95 is $16.475. The second red costs $16.47, so the half cent goes to the customer. Normal rounding gives $54.38, which doesn't match the example.
- **The red offer applies to every pair.** Four reds get two discounts. The examples only go up to three reds, which get one either way.
- **The bands start at $50 and $90 exactly.** $50.00 pays $2.95 and $90.00 ships free, matching "under $50" and "$90 or more".
- **An empty basket costs $0.00.** Read literally, it is "under $50" and pays $4.95 delivery.
- **Offers stack by adding their discounts.** Each offer works out its own discount from the items and doesn't see the others. The total discount never goes over the subtotal.
- **Unknown product codes are errors.** `add` throws and the API returns 422 rather than skipping them.
- **Prices are in US dollars, with no tax.** The brief doesn't mention either.
- **No checkout, stock, accounts or saved baskets.** The brief only asks for `add` and `total`. Remove and clear in the UI just change the list it sends.

## Layout

```
backend/    NestJS API: controllers → use-case handlers → domain ← infrastructure
frontend/   Next.js App Router UI: components → hooks → api → httpClient
.claude/    Claude Code skills describing the layer rules for each app
ADR.md      decisions and why
SPEC.md     the brief in detail, its gaps, and the checklist this was built from
```
