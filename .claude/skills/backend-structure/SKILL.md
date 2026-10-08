---
name: backend-structure
description: Reference for the NestJS backend layout in `backend/`. Use whenever adding or changing endpoints, use cases, domain rules, infrastructure sources, Nest modules or tests. Covers the layers (controller → handler → domain ← infrastructure), where DI wiring lives, naming, the test split, and the Docker/Make workflow.
---
# Backend Structure

The backend lives in `backend/`. It is a NestJS 12 app (ESM, TypeScript strict) organised in layers. It prices the Acme Widget Co basket. There is no database: `infrastructure/` loads the product catalogue, delivery tiers and offers from configuration.

## Basket rules

These come from the task in `README.md`. The expected totals there pin down the details the task leaves open.

- Money is integer cents. Dollars appear only in the UI.
- Catalogue: R01 Red Widget 3295, G01 Green Widget 2495, B01 Blue Widget 795.
- Delivery is charged on the subtotal after offers: under 5000 costs 495, under 9000 costs 295, 9000 or more is free.
- Offer "buy one red widget, get the second half price" applies once per pair of R01.
- A half cent rounds down, in the customer's favour (R01, R01 totals $54.37, not $54.38).
- The four example baskets in `README.md` are the acceptance tests. Keep them in the domain specs.

## Tech stack

- **Runtime**: Node 24 (`node:24-alpine` in Docker), ESM (`"type": "module"`). Relative imports end in `.js`, even from `.ts` files.
- **Web**: NestJS 12 on Express (`@nestjs/platform-express`).
- **Tests**: Vitest 4 (`globals: true`), `@nestjs/testing`, `supertest` for HTTP.
- **Lint/format**: oxlint (type-aware) and Prettier (single quotes, trailing commas).

## Directory layout

```
backend/
├── Dockerfile              # base → deps → dev (watch) | build → prod
├── vitest.config.ts        # unit tests: **/*.spec.ts
├── vitest.config.e2e.ts    # HTTP tests: **/*.e2e-spec.ts
├── src/
│   ├── main.ts             # entrypoint: load config, create app, configureApp, listen
│   ├── bootstrap.ts        # configureApp(): CORS, shutdown hooks. Shared with e2e tests
│   ├── app.module.ts       # root module, imports feature modules only
│   ├── config/             # loadAppConfig(env): typed settings from process.env
│   ├── controllers/        # thin HTTP layer: <feature>.controller.ts
│   ├── modules/            # <feature>.module.ts: DI wiring per feature
│   ├── use-cases/
│   │   ├── shared/handler.ts          # Handler<TRequest, TResponse>
│   │   └── <feature>/<action>/        # <action>.handler.ts, .request.ts, .response.ts
│   ├── domain/             # framework-free business rules, no Nest imports
│   └── infrastructure/     # sources that feed the domain (catalogue, rules config)
└── test/                   # e2e: boot AppModule and hit it over HTTP
```

## Layers (request flow)

```
HTTP request
  → controllers/<feature>.controller.ts     translate HTTP ↔ request/response DTOs
  → use-cases/<feature>/<action>/*.handler  orchestrate one use case
  → domain/                                  pure rules: entities, value objects, strategies
  ← infrastructure/                          implements domain interfaces (e.g. a catalogue source)
```

Rules that keep the layers honest:

- **Controllers** only map HTTP to a request DTO, call `handler.execute(request)` and return the response DTO. No business rules, no `if` on prices.
- **Handlers** implement `Handler<TRequest, TResponse>`. They depend on domain interfaces, never on concrete infrastructure classes.
- **Domain** has zero imports from `@nestjs/*`, Express or `process.env`. It can be unit-tested with plain `new`.
- **Infrastructure** implements interfaces declared in the domain. The domain never imports infrastructure.
- **Modules** are the only place that knows concrete classes. They bind interfaces to implementations with injection tokens.

## Dependency injection

TypeScript interfaces do not exist at runtime, so bind them through a token:

```ts
// domain/delivery/delivery-rule.ts
export interface DeliveryRule { chargeFor(subtotal: Cents): Cents; }
export const DELIVERY_RULE = Symbol('DeliveryRule');

// modules/basket.module.ts
providers: [
  { provide: DELIVERY_RULE, useFactory: () => new TieredDelivery(deliveryTiers) },
  PriceBasketHandler,
]

// use-cases/basket/price-basket/price-basket.handler.ts
constructor(@Inject(DELIVERY_RULE) private readonly delivery: DeliveryRule) {}
```

`Catalogue` is a concrete class built from a product list, so the class itself is the token: `{ provide: Catalogue, useFactory: ... }` and `@Inject(Catalogue)`.

Always write `@Inject(...)` on every constructor parameter, classes included. Vitest compiles with esbuild, which does not emit decorator metadata, so Nest cannot infer a parameter's type in the e2e tests.

Swapping an implementation (another offer, another delivery rule) is a one-line change in the module. Nothing else moves.

## Strategy pattern

Variable business rules are strategies behind a small interface in `domain/`. One class per rule, and the code that combines them never names a concrete rule:

```
domain/offers/offer.ts                          interface Offer { discountFor(items): Cents }
domain/offers/buy-one-get-second-half-price.ts  implements Offer
```

Adding a rule means adding a class and registering it in the module.

## Naming

- Files: `kebab-case` with a role suffix: `*.controller.ts`, `*.module.ts`, `*.handler.ts`, `*.request.ts`, `*.response.ts`, `*.spec.ts`, `*.e2e-spec.ts`.
- Classes: `PascalCase` matching the file (`PriceBasketHandler` in `price-basket.handler.ts`).
- Use-case folders are verbs: `use-cases/basket/price-basket/`.
- Injection tokens: `SCREAMING_SNAKE` `Symbol`, exported beside the interface.

## Tests

- **Unit** (`pnpm test`): `*.spec.ts` next to the file under test. Domain specs use plain `new` and no Nest testing module.
- **E2E** (`pnpm test:e2e`): `test/*.e2e-spec.ts`. Build the app with `Test.createTestingModule({ imports: [AppModule] })`, call `configureApp(app, loadAppConfig({}))`, then hit it with `supertest`.
- Test names describe behaviour ("applies free delivery at $90"), not methods.

## Adding a feature: checklist

1. **Domain**: interfaces, value objects and strategies in `src/domain/<concept>/`, with specs.
2. **Infrastructure**: implementations of domain interfaces in `src/infrastructure/`.
3. **Use case**: `src/use-cases/<feature>/<action>/` with handler, request and response.
4. **Controller**: `src/controllers/<feature>.controller.ts`, thin.
5. **Module**: `src/modules/<feature>.module.ts`. Bind tokens, register controller and handler.
6. **Register**: add the module to `imports` in `app.module.ts`.
7. **Tests**: unit specs for the domain and handler, one e2e spec for the endpoint.

## Running

- `make dev`: Compose Watch. Edits to `backend/src` and `backend/test` sync into the container and Nest recompiles.
- `make backend-test`: unit, e2e and lint inside the container.
- On the host: `cd backend && pnpm start:dev` (port 8000).

## Common pitfalls

- **`Cannot find module '/app/dist/main'`**: a stale `*.tsbuildinfo` made tsc skip emitting. It is in `.dockerignore`; delete it locally if it happens on the host.
- **`ERR_MODULE_NOT_FOUND` on a relative import**: ESM needs the `.js` extension (`'./app.module.js'`).
- **Nest cannot resolve a dependency**: a constructor parameter has no `@Inject(...)` (needed for classes too, see Dependency injection), or the provider is missing from the module.
- **CORS error in the browser**: add the origin to `CORS_ORIGINS` (comma-separated).

## Code style

- Small interfaces and small classes. One reason to change per file.
- Comments explain *why* (a business rule, a rounding decision), not *what*.
- No `any`. Use `unknown` at boundaries and narrow it.
- Prefer `readonly` fields and pure functions in the domain.
