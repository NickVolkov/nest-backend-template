import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { ArticleSchema, CreateArticleInputSchema } from '@/core/articles/schemas/article.schema';

export const ArticleProjection = z.object({
  id: ArticleSchema.shape.id,
  title: ArticleSchema.shape.title,
  status: ArticleSchema.shape.status,
  createdAt: z.string().datetime(),
  publishedAt: z.string().datetime().nullable(),
});

export class ArticleDto extends createZodDto(ArticleProjection) {}
export class CreateArticleDto extends createZodDto(CreateArticleInputSchema) {}
