# Optional Redis Adapter

Add Redis only for a concrete workflow such as expiring challenges, distributed coordination, rate limiting, or cache-aside reads. Keep Redis clients and key layout in `secondary-adapters/`; expose the narrowest useful abstract port from the owning core domain.

For cache-aside behavior:

1. Define a provider-agnostic cache port around the operations the use case needs.
2. Implement it with `ioredis` in a secondary adapter.
3. Make key construction, serialization, TTL, and invalidation explicit and testable.
4. Inject the port into the use case through module composition.
5. Test expiry and invalidation against a real Redis container when correctness depends on server behavior.

Avoid a generic cache dependency when a domain-specific store communicates intent better. Never expose Redis response types to core code.
