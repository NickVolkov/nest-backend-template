import { ArticleSummary } from '@/core/articles/dto/article.dto';
import { ArticleStatus } from '@/core/articles/schemas/article.schema';

export type FindArticlesPageInput = {
  offset: number;
  limit: number;
  statuses?: ArticleStatus[];
};

export type ArticlesPage = {
  items: ArticleSummary[];
  total: number;
};

export abstract class ArticleReadRepository {
  abstract findPage(input: FindArticlesPageInput): Promise<ArticlesPage>;
}
