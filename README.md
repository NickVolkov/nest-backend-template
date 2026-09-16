# Nest Backend Template

Runnable foundation for an opinionated NestJS backend using Fastify, Zod, TypeORM, PostgreSQL, Pino, Jest, and pnpm.

## Create a project

Prerequisites: Node.js 22+, pnpm, Git, and the `apm` CLI must be available on `PATH`. Configure `user.name` and `user.email` in Git before bootstrapping.

Create and initialize a project with `scaffoldrr`:

```bash
npx scaffoldrr create NickVolkov/nest-backend-template my-backend
cd my-backend
```

The command installs dependencies and shared APM skills, initializes a new Git repository, and replaces the documentation snapshot with an updateable `docs/engineering` Git subtree.

Clone the repository only when contributing to the template itself:

```bash
git clone https://github.com/NickVolkov/nest-backend-template.git
```

## Template updates

Check for and apply upstream template changes from a clean project worktree:

```bash
npx scaffoldrr status
npx scaffoldrr update --dry-run
npx scaffoldrr update
```

Review and commit the resulting changes in the project repository.

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
