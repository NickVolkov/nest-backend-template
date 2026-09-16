import path from 'node:path';

import { ApiSchema } from '@/config/schemas/api.schema';
import { AppSchema } from '@/config/schemas/app.schema';
import { PostgresSchema } from '@/config/schemas/postgres.schema';
import { getConfig } from '@/lib/config/config';
import { s } from '@/lib/config/schema';

const ConfigSchema = s.object({
  app: AppSchema,
  apps: s.object({ api: ApiSchema }),
  database: PostgresSchema,
});

export type AppConfig = ReturnType<typeof ConfigSchema.parse>;

export const config = getConfig<AppConfig>(ConfigSchema, {
  folder: path.resolve(process.cwd(), 'config'),
  files: ['config.yml'],
});
