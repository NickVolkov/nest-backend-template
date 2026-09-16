# Events and Direct Calls

Default to a direct use-case or port call. It is explicit, traceable, type-safe, and makes ordering and failure visible to the caller.

Use an event only when the producer must remain unaware of every consumer. Multiple consumers alone are not enough: if the workflow owns the follow-up actions, call them directly from the orchestrating use case.

## Decision test

Choose a direct call when any of these are true:

- the caller needs the result;
- the next action is part of the same business workflow;
- failure must abort or change the current operation;
- ordering is required;
- the producer already knows the consumer's responsibility.

Choose an event when the fact is complete without its consumers and new consumers should be addable without changing the producer. Name the event as a past-tense domain fact such as `ArticlePublished`, not as a command such as `SendArticleEmail`.

## Delivery contract

Before publishing an event, define:

1. Whether delivery is in-process or durable.
2. Whether handling is synchronous or asynchronous.
3. Whether delivery is at-most-once or at-least-once.
4. How retries, dead letters, timeouts, and observability work.
5. How consumers achieve idempotency.
6. Whether database commit and publication must be atomic; use an outbox when they must be.
7. The stable event name, versioned payload schema, and ownership of compatibility.

If these answers are absent, the event boundary is not designed yet.

## Provider-agnostic port

The core owns the smallest publishing contract it needs:

```typescript
export abstract class DomainEventPublisher {
  abstract publish<Event>(name: string, payload: Event): Promise<void>;
}
```

Broker clients, Nest event emitters, serialization, retry policy, and topic names belong to secondary adapters. A domain use case depends on `DomainEventPublisher`, never on Kafka, RabbitMQ, SNS, or an emitter SDK.

For a durable event, publish a schema-derived payload with identifiers and facts consumers need. Do not publish an entity instance or ORM row.

## Fire-and-forget

An un-awaited promise is still a failure boundary. If the operation is intentionally detached, make that policy visible and route rejection to structured logging or a durable queue. Detached in-memory work is lost when the process exits and must not carry correctness-critical behavior.

## Event anti-patterns

- Emitting an event merely to avoid importing another use case.
- Request/response disguised as an event while the producer waits for a consumer result.
- Publishing before the database transaction commits.
- Treating an in-process emitter as durable delivery.
- Publishing mutable entities, persistence rows, or provider payloads.
- Adding consumers that silently become required for the producer to be correct.
- Retrying a non-idempotent consumer without a deduplication strategy.
- Using event names as imperative commands while claiming producer/consumer decoupling.
