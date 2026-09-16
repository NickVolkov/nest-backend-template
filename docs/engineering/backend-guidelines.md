# Backend Engineering Guidelines

These are the target conventions for an opinionated NestJS backend built with Fastify, Zod, TypeORM, PostgreSQL, Pino, Jest, and pnpm.

## Hexagonal boundaries

```text
primary-adapters  ->  core  <-  secondary-adapters
   entry points       domain       infrastructure
```

| Layer                     | Responsibilities                                                        | Allowed dependencies                                                                      |
| ------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/core/`               | Schemas, value objects, entities, use cases, ports, DTOs, domain errors | Core code, NestJS contracts, Zod/`nestjs-zod`, Node primitives, and pure domain libraries |
| `src/secondary-adapters/` | TypeORM repositories and external infrastructure adapters               | Core contracts plus infrastructure libraries and provider SDKs                            |
| `src/primary-adapters/`   | Controllers, guards, filters, bootstrapping, OpenAPI, and composition   | Core use cases plus NestJS platform code; the composition root may wire secondary modules |

Production imports point inward. Core code imports neither adapter layer and contains no ORM, database, Redis, HTTP-client, or provider SDK types. Adapter-private types stay out of core contracts.

## Domain and application responsibilities

Entities and value objects own construction invariants, state transitions, state guards, arithmetic, domain computations, and deterministic DTO mappings. Expose intention-revealing methods instead of mutating entity fields from use cases.

Use cases have one public `execute()` method and orchestrate the workflow: load dependencies, enforce caller ownership, select ports, invoke domain behavior, persist, and return an entity or final projection. A use case does not reproduce aggregate rules or repeatedly parse already validated data.

When a rule needs data outside an aggregate, the use case obtains the data and passes the resulting fact or value to an entity or provider-agnostic domain policy. Controllers contain transport concerns, not business workflows.

Prefer direct use-case calls. Introduce events only when the emitting domain must remain unaware of every consumer, and define delivery, retry, idempotency, and transaction behavior at the same time. Read [events.md](events.md) before introducing an event-driven path.

See the canonical [Article entity](canonical-module/src/core/articles/entities/article.entity.ts), [use cases](canonical-module/src/core/articles/use-cases/), and [controller](canonical-module/src/primary-adapters/api/controllers/article.controller.ts).

## Ports, adapters, and persistence

- Declare repositories and external-service ports as provider-agnostic abstract classes in the owning core domain.
- Put TypeORM entities and physical row shapes under `secondary-adapters/postgres/` and map them explicitly to schema-defined domain data.
- Use separate read and write repositories when query projections differ materially from aggregates. The write repository persists domain entities; the read repository maps storage rows directly into validated, DTO-ready projections. See [cqrs.md](cqrs.md).
- Bind abstract ports to implementations in secondary-adapter modules. Compose infrastructure and core modules in a primary adapter.
- Add one forward-only migration per database change. Treat every committed migration as immutable.
- Integration-test migrations and row mappings against PostgreSQL with testcontainers when persistence behavior changes.

See the canonical write [repository contract](canonical-module/src/core/articles/repository/article.repository.ts), read [repository contract](canonical-module/src/core/articles/repository/article-read.repository.ts), [TypeORM implementations](canonical-module/src/secondary-adapters/postgres/repository/), and [migration](canonical-module/src/secondary-adapters/postgres/migrations/1700000000000-CreateArticles.ts).

## Modules and naming

Core and adapter modules expose `static register(imports)` when dependencies are supplied by the composition root. Core modules provide and export their public use cases.

| Kind                | Convention                                                                  |
| ------------------- | --------------------------------------------------------------------------- |
| Schema              | `schemas/<name>.schema.ts`; `<Name>Schema` and inferred `<Name>`            |
| Value object        | `value-objects/<name>.ts`; `<Name>`                                         |
| Domain entity       | `entities/<name>.entity.ts`; `<Name>Entity`                                 |
| Use case            | `use-cases/verb-noun.use-case.ts`; `VerbNounUseCase`                        |
| Core repository     | `repository/<name>.repository.ts`; `<Name>Repository`                       |
| Postgres repository | `repository/<name>-in-postgres.repository.ts`; `<Name>InPostgresRepository` |
| TypeORM entity      | `secondary-adapters/postgres/entities/<name>.entity.ts`; `<Name>EntityDB`   |
| DTO                 | `dto/<name>.dto.ts`; `<Name>Dto`                                            |
| Domain error        | `<domain>.errors.ts`; a specific error name                                 |

Use the configured source alias across directories. Relative imports are acceptable for tightly co-located files in one directory, never to obscure a layer boundary.

## HTTP and OpenAPI

- Use Fastify through `@nestjs/platform-fastify`.
- Controllers inject use cases and return DTO projections, never persistence rows.
- Validate bodies, parameters, and queries at the HTTP boundary with Zod-backed DTOs or an explicit pipe.
- Add `@ApiTags` to each controller and the success decorator matching the real status code.
- Document declared domain failures with matching Swagger responses. Use `@ApiExtraModels` plus a shared `oneOf` helper when errors share a status.
- Define domain errors beside the domain through the shared error factory and let the global filter produce a stable envelope.
- Regenerate and review the OpenAPI artifact when routes, schemas, status codes, or documented errors change.

Transport-only contracts such as health responses may live in the primary adapter. Domain input and output contracts belong to their core module.

## Configuration and operations

Load YAML defaults, overlay environment variables, and validate once at startup with Zod. Keep one schema per configuration section, use coercion-aware helpers for environment strings, commit only non-secret defaults or placeholders, and consume a typed config object instead of reading `process.env` throughout the application.

Use Pino for structured logs. Keep HTTP logging and metrics instrumentation in entry-point or infrastructure code. Add Prometheus only as an explicit feature with dependencies, ownership, and tests.

Redis is not a default dependency. Introduce it behind a narrow core port only for a concrete caching or coordination requirement; see [redis-recipe.md](redis-recipe.md).

## Feature completion

For a new capability:

1. Define canonical schemas and trusted boundaries.
2. Put invariants and transitions in value objects or entities.
3. Declare provider-agnostic ports and explicit adapter mappings.
4. Add one orchestration-focused use case per operation.
5. Add controllers with complete OpenAPI success and failure declarations.
6. Wire modules at the composition root and add a forward-only migration if persistence changes.
7. Test domain behavior, orchestration, mappings, migrations, and the API contract in proportion to risk.

Completion requires typecheck, focused tests, and broader integration tests for cross-layer changes.

During implementation and review, check the concrete failure modes in [anti-patterns.md](anti-patterns.md).
