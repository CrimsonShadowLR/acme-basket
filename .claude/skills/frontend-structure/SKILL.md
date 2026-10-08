---
name: frontend-structure
description: Reference for the Next.js frontend layout in `frontend/`. Use whenever adding or changing pages, feature components, API calls, React Query hooks or Tailwind styles. Covers the App Router split (app/ for routes, components/ for features), the component → hook → api → httpClient layers, server vs client components, and the Docker/dev workflow.
---
# Frontend Structure

The frontend lives in `frontend/`. It is a Next.js 16 App Router app with React 19, TypeScript strict and Tailwind v4. It is the Acme Widget Co basket UI: pick products, see the basket priced by the backend. Each feature folder owns its API calls, hooks and components, and server state goes through React Query.

**Next 16 differs from older Next.** Before using an API you are unsure about, read the bundled docs in `frontend/node_modules/next/dist/docs/` (see `frontend/AGENTS.md`).

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19.
- **Server state**: `@tanstack/react-query` v5.
- **HTTP**: `fetch`, wrapped by `src/shared/httpClient.ts`.
- **Styling**: Tailwind v4 (`@import "tailwindcss"` in `globals.css`, no `tailwind.config.js`), loaded through the `@tailwindcss/turbopack` rule in `next.config.ts`, so there is no `postcss.config`.
- **Lint/types**: ESLint (`eslint-config-next`), `pnpm typecheck` (`next typegen && tsc --noEmit`).
- **Tests**: Vitest (`pnpm test`) for plain functions, in `*.test.ts` next to the code. Logic worth testing goes in a plain function (like `Basket/basketItems.ts`), not inside a hook or component.

## Directory layout

```
frontend/
├── Dockerfile               # base → deps → dev (next dev) | build → prod (standalone)
├── next.config.ts           # output: "standalone"
└── src/
    ├── app/                 # routing only
    │   ├── layout.tsx       # html shell, fonts, <Providers>
    │   ├── providers.tsx    # "use client": QueryClientProvider
    │   ├── page.tsx         # composes feature components, no logic
    │   └── globals.css
    ├── shared/
    │   ├── env.ts           # NEXT_PUBLIC_API_BASE_URL
    │   └── httpClient.ts    # get<T>, post<T, B>, HttpError
    └── components/
        └── <FeatureName>/   # PascalCase, one folder per UI feature
            ├── index.tsx    # the feature's entry component (named export)
            ├── api/         # one file per endpoint: <verb><Thing>.ts
            ├── hooks/       # one file per hook: use<Thing>.ts
            └── components/  # private sub-components of this feature
```

## Layers

```
app/page.tsx                         composes features
  → components/<Feature>/index.tsx   renders, handles loading/error
  → components/<Feature>/hooks/      useQuery / useMutation
  → components/<Feature>/api/        typed request + response
  → shared/httpClient.ts → fetch → backend
```

Components never call `fetch`. Hooks never build URLs. API functions only use `shared/httpClient`. Each layer can be replaced or mocked on its own.

## Server vs client components

- Files in `app/` stay **server components** unless they need state or effects.
- A feature that uses hooks starts with `"use client"` in its `index.tsx`. Its children inherit the client boundary.
- Keep business rules out of the frontend. The backend computes totals. The UI shows them.

## Conventions

### API functions: `components/<Feature>/api/<verb><Thing>.ts`
- Declare the response `interface` in camelCase, matching the backend JSON.
- Named export that unwraps the response if needed:
  ```ts
  export async function getProducts(): Promise<Product[]> {
    const { products } = await get<ProductsResponse>("/products");
    return products;
  }
  ```
- Paths are relative; `httpClient` owns the base URL.

### Hooks: `components/<Feature>/hooks/use<Thing>.ts`
- Wrap one API function in `useQuery` or `useMutation`.
- `queryKey` is a string array unique to the endpoint (`["products"]`).

### Components
- Named export matching the folder (`export function Basket()`).
- Handle `isPending` and `isError` on screen. Never leave a blank state.
- Small components: if a file grows past one screen, split into `components/`.

### Styling
- Tailwind utility classes only. Global styles live in `globals.css`.
- Light theme: `bg-background` page, white cards with `border-zinc-200`, `text-zinc-500` for muted text.
- Container pattern: `mx-auto w-full max-w-5xl px-6 py-16` (see `app/page.tsx`).

## Adding a feature: checklist

1. `src/components/<FeatureName>/` with `api/`, `hooks/` and `index.tsx`.
2. API function with a typed response.
3. Hook around it.
4. Component that consumes the hook, with loading and error states.
5. Render it from a page in `src/app/`.

## Running

- `make dev`: Compose Watch syncs `frontend/src` and `frontend/public` into the container. Next hot-reloads.
- `make frontend-check`: lint, typecheck and tests in a one-off container. No running stack needed.
- On the host: `cd frontend && pnpm dev` (port 3000).

## Common pitfalls

- **`Cannot find name 'LayoutProps'`**: route types are generated. Run `pnpm typecheck`, which runs `next typegen` first.
- **API URL is wrong in the prod image**: `NEXT_PUBLIC_*` is inlined at build time. Pass it as a build arg (`docker-compose.yml` does).
- **Hook error in a server component**: the file is missing `"use client"`.
- **CORS error**: the backend's `CORS_ORIGINS` must include the frontend origin.

## Code style

- PascalCase for components and their folders, camelCase for functions, hooks and variables.
- One responsibility per file: one component, one hook, one API call.
- Type every API response with an `interface`. No `any`; use `unknown` at boundaries.
- Use `import type` for type-only imports.
