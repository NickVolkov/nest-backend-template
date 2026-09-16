# Nest Backend Repository Instructions

These repository instructions are authoritative. Apply the target architecture to new and modified code without broad unrelated refactors.

## Required reading

- **Backend changes:** Before planning, writing, or reviewing NestJS modules, controllers, use cases, entities, repositories, adapters, configuration, migrations, or backend tests, read [`docs/engineering/backend-guidelines.md`](docs/engineering/backend-guidelines.md).
- **Schema-first changes:** When a task touches a core schema, value object, entity, DTO, repository contract, read model, or persistence mapping, also read [`docs/engineering/schema-first.md`](docs/engineering/schema-first.md).
- **Canonical module:** When adding a domain vertical slice, inspect [`docs/engineering/canonical-module`](docs/engineering/canonical-module/) and preserve its dependency direction and validation boundaries.

## Hard boundaries

- `src/core/` imports neither adapter layer and contains no ORM, database, Redis, HTTP-client, or provider SDK types.
- `src/secondary-adapters/` implements abstractions from `core/`. `src/primary-adapters/` owns entry points and composition.
- Controllers inject use cases. Cross-layer dependencies use provider-agnostic abstract classes declared in `core/`.
- Entities and value objects own domain invariants and transitions. Use cases own orchestration, authorization, dependency lookup, persistence, and external calls.
- Use the `@/` alias across directories under `src/`.
- Add a forward-only TypeORM migration for each database change. Treat committed migrations as immutable.

## Workflow

- Use `pnpm` and the scripts in `package.json`.
- For TypeScript changes, run `pnpm typecheck` and focused Jest tests. Run integration tests for adapter or database behavior.
- For API changes, regenerate and review `openapi.yaml` with `pnpm openapi:generate`.
- Preserve unrelated working-tree changes.
