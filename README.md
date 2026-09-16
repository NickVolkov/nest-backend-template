# Nest Backend Template

Runnable foundation for an opinionated NestJS backend using Fastify, Zod, TypeORM, PostgreSQL, Pino, Jest, and pnpm.

## Create a project

Clone with history when you want centrally updateable architecture rules:

```bash
git clone https://github.com/your-user/nest-backend-template.git my-backend
cd my-backend
pnpm ai:init
pnpm install
```

A Degit copy contains the current documentation snapshot but not the Git history required by `git subtree pull`:

```bash
degit your-user/nest-backend-template my-backend
```

## Run locally

```bash
cp .env.example .env
docker compose up -d postgres
pnpm install
pnpm db:migration:run
pnpm start:dev
```

The health endpoint is `GET /api/health`; Swagger UI is available at `/docs`.

## Architecture rules

The shared rules are vendored into `docs/engineering` with Git subtree.

```bash
pnpm ai:init # once after cloning
pnpm ai:pull
pnpm ai:push # maintainers with write access only
```

`ai:init` intentionally fails if the `ai-rules` remote already exists. Projects created with Degit receive a static documentation snapshot; attaching it as an updateable subtree is a separate manual migration.

## Verification

```bash
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm openapi:generate
```

`pnpm test:integration` requires Docker and starts a disposable PostgreSQL container.
