import { s } from '@/lib/config/schema';

export const AppSchema = s.object({
  name: s.string().min(1),
  node_env: s.options(['development', 'test', 'production']),
});
