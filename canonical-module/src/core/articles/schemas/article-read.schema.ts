import { z } from 'zod';

import { ArticleSchema, ArticleStatusSchema } from '@/core/articles/schemas/article.schema';

const ArticleStatusesQuerySchema = z.preprocess(
  (value) => (value === undefined || Array.isArray(value) ? value : [value]),
  z.array(ArticleStatusSchema).min(1).optional(),
);

export const ArticleListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  statuses: ArticleStatusesQuerySchema,
});
export type ArticleListQuery = z.output<typeof ArticleListQuerySchema>;

export const ArticleSummaryProjection = ArticleSchema.pick({
  id: true,
  title: true,
  status: true,
}).extend({
  createdAt: z.string().datetime(),
});
export type ArticleSummary = z.output<typeof ArticleSummaryProjection>;

export const ArticleListResponseSchema = z.object({
  items: z.array(ArticleSummaryProjection),
  meta: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    hasNext: z.boolean(),
  }),
});
export type ArticleListResponse = z.output<typeof ArticleListResponseSchema>;
