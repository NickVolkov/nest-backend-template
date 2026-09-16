# Backend Anti-Patterns

Use these examples during design and review. Each smell identifies a boundary whose responsibility has drifted.

## Business rules in a use case

```typescript
// Smell: orchestration mutates domain state and enforces an invariant.
if (article.status === 'PUBLISHED') throw new Error('Already published');
article.status = 'PUBLISHED';

// Target: the entity owns the transition.
article.publish();
```

## Repeated structural models

`ArticleState`, `ArticleProps`, `ArticleRow`, and decorated DTO fields repeating the same structure create competing sources of truth. Define `ArticleSchema`, infer its data type, and derive unchanged projections with `pick` or `omit`.

## Schemas declared in DTO files

A DTO file containing `z.object`, `pick`, `omit`, `extend`, preprocessing, or inferred types becomes a second schema location and invites core code to depend on transport classes. Keep all schema construction and structural types under `schemas/`; make every DTO a thin `createZodDto(...)` wrapper.

## Infrastructure in core

A core repository accepting a TypeORM `FindOptionsWhere`, Redis client, HTTP response, or provider SDK type couples policy to an adapter. Express the required operation as a provider-agnostic abstract class and map adapter types at the boundary.

## Repository injection in controllers

Controllers that query repositories accumulate authorization and workflow rules. Inject a use case; let it own caller scope, orchestration, and the selected port.

## Persistence rows as API responses

Returning a TypeORM entity leaks column naming, nullability, and accidental fields. A write repository restores a domain entity; a read repository maps to a validated final projection. See [cqrs.md](cqrs.md).

## Aggregate restoration for projection-only reads

Loading full aggregates, nested entities, and domain behavior for a paginated list wastes work and couples the query to the write model. Use a dedicated read repository when the result is a purpose-built projection.

## Parsing everywhere

Repeated `Schema.parse()` calls inside controllers, use cases, entities, and `toDto()` obscure the trust boundary. Parse HTTP input, database/provider output, and unknown construction input once; carry typed values afterward.

## Events as invisible control flow

Events used for required workflow steps hide ordering and failure. Call the dependency directly unless the producer is genuinely independent of every consumer. Apply the delivery checklist in [events.md](events.md) when an event is justified.

## Generic cache leakage

Passing Redis keys and TTL policy through controllers or entities leaks infrastructure across layers. Expose a narrow domain-owned port and keep key layout, serialization, expiry, and invalidation in the adapter.

## Mutable migrations

Editing a migration that may have run creates environments with the same migration name and different schemas. Add a new forward-only migration and test the affected migration chain.

## Framework-success decorators by habit

Using `@ApiOkResponse` for every route makes OpenAPI disagree with runtime behavior. Document the actual status: for example, `@ApiCreatedResponse` for a `201` create endpoint.
