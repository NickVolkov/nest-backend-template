import { s } from '@/lib/config/schema';

export const PostgresSchema = s.object({
  url: s.url(),
  log: s.boolean(),
  run_migrations: s.boolean(),
});
