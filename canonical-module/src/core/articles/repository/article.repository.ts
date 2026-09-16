import { ArticleEntity } from '@/core/articles/entities/article.entity';

export abstract class ArticleRepository {
  abstract findById(id: string): Promise<ArticleEntity | null>;
  abstract save(article: ArticleEntity): Promise<void>;
}
