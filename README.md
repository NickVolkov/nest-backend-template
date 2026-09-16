# Nest Backend Template

Runnable foundation for an opinionated NestJS backend using Fastify, Zod, TypeORM, PostgreSQL, Pino, Jest, and pnpm.

## Create a project

Prerequisites: Node.js 22+, pnpm, Git, and the `apm` CLI must be available on `PATH`. Configure `user.name` and `user.email` in Git before bootstrapping.

Create a project with Degit. The required `PROJECT_NAME` environment variable sets the package and APM project names:

```bash
PROJECT_NAME=my-backend npx degit NickVolkov/nest-backend-template my-backend
cd my-backend
pnpm scaffold:init
pnpm install
```

`scaffold:init` must run before `git init`. It installs the shared APM skills, initializes a new Git repository, and replaces the documentation snapshot with an updateable `docs/engineering` Git subtree.

Clone the repository only when contributing to the template itself:

```bash
git clone https://github.com/NickVolkov/nest-backend-template.git
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

`scaffold:init` adds the `ai-rules` remote automatically. `ai:init` is available for existing repositories that need to attach the remote manually and intentionally fails when the remote already exists.

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
