# Schema-First Core Models

Use Zod schemas as the single structural source for core concepts. Types, projections, DTOs, repository contracts, and entity properties derive from those schemas instead of restating fields.

## Canonical structures

Define reusable domain data as a Zod schema and infer its validated output type. Use `z.output<typeof Schema>` internally. Use `z.input<typeof Schema>` only when coercion or transformation creates a genuinely different pre-parse shape.

Do not repeat canonical fields as `State`, `Props`, `Row`, standalone read-model classes, or decorated DTO properties. A TypeORM entity is a separate, adapter-private physical model.

See [article.schema.ts](canonical-module/src/core/articles/schemas/article.schema.ts) for the executable reference.

## Projections and DTOs

Use `.pick()` or `.omit()` when field names, types, and meanings remain unchanged. Use `.extend()` to add fields, not to silently replace an existing field with another meaning.

When an API serializes dates, renames or groups values, or adds computed fields, define the final output projection explicitly and reuse unchanged leaf schemas through `SourceSchema.shape.field`. DTO classes remain thin `createZodDto(Projection)` wrappers with no duplicate properties.

See [article.dto.ts](canonical-module/src/core/articles/dto/article.dto.ts).

## Validation boundaries

Parse where trust changes, then carry typed values internally:

| Boundary                           | Behavior                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| HTTP request                       | Let `nestjs-zod` or an explicit pipe validate the request DTO                 |
| Entity construction from `unknown` | Parse once with the canonical schema before constructing valid state          |
| Database or provider response      | Treat adapter data as untrusted and validate before restoration or projection |
| Use case                           | Accept schema-derived validated types without parsing again                   |
| `toDto()`                          | Perform a typed deterministic mapping without routine output parsing          |

Parsing a deterministic object immediately before returning it often hides an imprecise type. Make the mapping satisfy the projection type. Parse again only when untrusted or dynamically assembled data has not crossed a validation boundary.

## Entities and value objects

An entity adds identity, invariants, transitions, and behavior to schema-defined data; it does not create a parallel model. Keep constructors private when callers must use controlled `create` or `restore` paths. A value object wraps a schema-derived value and owns the arithmetic, comparison, formatting policy, and invariants for that concept.

See [article.entity.ts](canonical-module/src/core/articles/entities/article.entity.ts) and its [tests](canonical-module/src/core/articles/entities/article.entity.spec.ts).

## Repositories and persistence

Write repositories accept and return domain entities. Read repositories may return final schema-derived projections when recreating an aggregate adds no value.

Keep database entities and row types in the persistence adapter. Map base units, dates, nullability, JSON, and provider identifiers explicitly. Validate mapped logical data before restoring an entity. Do not leak TypeORM types into core.

Domain and database schemas serve different purposes. Change TypeORM models with a new forward-only migration and test the affected migration chain or mapping.

## Change checklist

- Every modified core structure has one canonical schema.
- Types, projections, DTOs, and repository contracts derive from it.
- Parsing occurs at trust boundaries instead of throughout the call chain.
- Aggregate invariants live in entities or value objects.
- Persistence models remain adapter-private and map explicitly.
- API contract changes regenerate the OpenAPI artifact.
- Focused tests cover validation, mapping, and transitions.
