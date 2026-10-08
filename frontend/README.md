# Frontend

Next.js (App Router) UI for the Acme Widget Co basket. See the root `README.md` for
how to run the stack and `../.claude/skills/frontend-structure/SKILL.md` for the
layer rules.

```bash
pnpm dev          # http://localhost:3000
pnpm lint         # eslint
pnpm typecheck    # next typegen + tsc
pnpm build
```

The API base URL comes from `NEXT_PUBLIC_API_BASE_URL` (default
`http://localhost:8000`). Next inlines it at build time.
