# Pragmatic CQRS

Use CQRS as a local separation of write aggregates and read projections. It does not require a command bus, an event bus, separate services, or separate databases.

## When to split

Keep one repository while reads and writes both naturally operate on the same aggregate. Add a read repository when a query has materially different needs: pagination, filtering, sorting, joins, aggregation, a subset of fields, or a DTO shape that would make aggregate restoration wasted work.

```text
command -> use case -> ArticleRepository -> ArticleEntity -> write tables
query   -> use case -> ArticleReadRepository -> ArticleSummary projection -> DTO
```

The write side protects invariants. Its repository accepts and returns domain entities. The read side answers a specific query efficiently. Its repository returns a schema-derived, DTO-ready projection and never exposes TypeORM rows.

## Contracts in core

The write contract speaks in aggregates:

```typescript
export abstract class ArticleRepository {
  abstract findById(id: string): Promise<ArticleEntity | null>;
  abstract save(article: ArticleEntity): Promise<void>;
}
```

The read contract speaks in query inputs and final projections:

```typescript
export type FindArticlesPageInput = {
  offset: number;
  limit: number;
  statuses?: ArticleStatus[];
};

export type ArticlesPage = {
  items: ArticleSummary[];
  total: number;
};

export abstract class ArticleReadRepository {
  abstract findPage(input: FindArticlesPageInput): Promise<ArticlesPage>;
}
```

`ArticleSummary` is inferred from `ArticleSummaryProjection`, which reuses canonical leaves from `ArticleSchema`. The projection is a core API/read contract, not a persistence row.

## Read adapter

The adapter selects only the data the query needs, maps physical values, and validates untrusted database output at the adapter boundary:

```typescript
private toSummary(row: ArticleEntityDB): ArticleSummary {
  return ArticleSummaryProjection.parse({
    id: row.id,
    title: row.title,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  });
}
```

After this boundary, the use case receives trusted DTO-ready values. It may add deterministic pagination metadata without restoring `ArticleEntity` or reapplying domain rules.

See the executable [Article write repository](canonical-module/src/secondary-adapters/postgres/repository/article-in-postgres.repository.ts), [Article read repository](canonical-module/src/secondary-adapters/postgres/repository/article-read-in-postgres.repository.ts), and [list use case](canonical-module/src/core/articles/use-cases/list-articles.use-case.ts).

## Ownership and authorization

Put mandatory tenant or owner identifiers in the read-repository input so the database query enforces scope. Do not fetch an unrestricted page and filter it in memory. Use cases translate the authenticated caller into that required query scope.

## Testing

- Unit-test pagination and query orchestration with a mocked read repository.
- Integration-test filters, ordering, joins, row conversion, and projection parsing against PostgreSQL.
- Contract-test the controller response and OpenAPI schema.
- Keep write-side entity tests focused on invariants and transitions.

## CQRS anti-patterns

- Restoring every aggregate for a list endpoint and immediately calling `toDto()` on each one.
- Returning `ArticleEntityDB`, `SelectQueryBuilder`, or raw aliases from a core repository.
- Making a generic read repository whose projections are unrelated to one use case or API contract.
- Duplicating canonical fields in a handwritten read-model interface instead of deriving a projection.
- Sharing one method that sometimes returns entities and sometimes returns DTOs.
- Introducing buses or eventual consistency when a read/write repository split is sufficient.
