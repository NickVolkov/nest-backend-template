import { s } from '@/lib/config/schema';

export const ApiSchema = s.object({
  port: s.int().min(1).max(65535),
  host: s.url(),
});
