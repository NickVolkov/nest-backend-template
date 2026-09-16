import { Injectable } from '@nestjs/common';

import { ArticleEntity } from '@/core/articles/entities/article.entity';
import { ArticleRepository } from '@/core/articles/repository/article.repository';
import { CreateArticleInput } from '@/core/articles/schemas/article.schema';

@Injectable()
export class CreateArticleUseCase {
  constructor(private readonly articles: ArticleRepository) {}

  async execute(input: CreateArticleInput): Promise<ArticleEntity> {
    const article = ArticleEntity.create(input);
    await this.articles.save(article);
    return article;
  }
}
