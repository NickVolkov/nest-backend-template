import { createZodDto } from 'nestjs-zod';

import { ArticleProjection } from '@/core/articles/schemas/article-output.schema';
import { CreateArticleInputSchema } from '@/core/articles/schemas/article.schema';

export class ArticleDto extends createZodDto(ArticleProjection) {}
export class CreateArticleDto extends createZodDto(CreateArticleInputSchema) {}
