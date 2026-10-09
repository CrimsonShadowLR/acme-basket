# Backend

NestJS API for the Acme Widget Co basket. See the root `README.md` for how to run
the stack and `../.claude/skills/backend-structure/SKILL.md` for the layer rules.

```bash
pnpm start:dev    # watch mode on http://localhost:8000
pnpm test         # unit tests (*.spec.ts, next to the code)
pnpm test:integration # the whole app over HTTP, in-process (test/*.integration-spec.ts)
pnpm lint         # oxlint, type-aware
pnpm typecheck    # tsc over src, test and specs (the build skips specs)
pnpm format:check # prettier, read-only
```
