import { createZodDto } from 'nestjs-zod';

import {
  ArticleListQuerySchema,
  ArticleListResponseSchema,
  ArticleSummaryProjection,
} from '@/core/articles/schemas/article-read.schema';

export class ArticleListQueryDto extends createZodDto(ArticleListQuerySchema) {}
export class ArticleSummaryDto extends createZodDto(ArticleSummaryProjection) {}
export class ArticleListResponseDto extends createZodDto(ArticleListResponseSchema) {}
