import { z } from 'zod';

import { ArticleSchema } from '@/core/articles/schemas/article.schema';

export const ArticleProjection = z.object({
  id: ArticleSchema.shape.id,
  title: ArticleSchema.shape.title,
  status: ArticleSchema.shape.status,
  createdAt: z.string().datetime(),
  publishedAt: z.string().datetime().nullable(),
});

export type ArticleOutput = z.output<typeof ArticleProjection>;
