import { z } from 'zod';

export const ArticleStatusSchema = z.enum(['DRAFT', 'PUBLISHED']);

export const ArticleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1),
  status: ArticleStatusSchema,
  createdAt: z.date(),
  publishedAt: z.date().nullable(),
});

export type Article = Readonly<z.output<typeof ArticleSchema>>;

export const CreateArticleInputSchema = ArticleSchema.pick({ title: true });
export type CreateArticleInput = z.output<typeof CreateArticleInputSchema>;
