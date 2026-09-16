# AI Architecture Rules

Shared, versioned architecture guidance for opinionated NestJS backends using Fastify, Zod, TypeORM, PostgreSQL, Pino, Jest, and pnpm.

- Read [backend-guidelines.md](backend-guidelines.md) before changing backend architecture or adding a feature.
- Read [schema-first.md](schema-first.md) when changing schemas, entities, DTOs, repository contracts, or persistence mappings.
- Use [canonical-module](canonical-module/) as the executable reference for a complete vertical slice.
- Redis is optional; add it only when a concrete workflow needs it by following [redis-recipe.md](redis-recipe.md).

## Validation

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
```

## Subtree consumers

Consumer projects mount this repository at `docs/engineering` and keep the remote explicit:

```bash
git remote add -f ai-rules git@github.com:your-user/ai-architecture-rules.git
git subtree add --prefix=docs/engineering ai-rules main --squash
```

After the initial add, consumers use their `ai:pull` and `ai:push` package scripts. `ai:push` requires write access and is intended for maintainers.
