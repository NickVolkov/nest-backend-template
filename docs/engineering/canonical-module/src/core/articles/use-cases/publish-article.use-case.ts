import { Injectable } from '@nestjs/common';

import { ArticleNotFoundError } from '@/core/articles/articles.errors';
import { ArticleEntity } from '@/core/articles/entities/article.entity';
import { ArticleRepository } from '@/core/articles/repository/article.repository';

@Injectable()
export class PublishArticleUseCase {
  constructor(private readonly articles: ArticleRepository) {}

  async execute(id: string): Promise<ArticleEntity> {
    const article = await this.articles.findById(id);
    if (!article) throw new ArticleNotFoundError();
    article.publish();
    await this.articles.save(article);
    return article;
  }
}
