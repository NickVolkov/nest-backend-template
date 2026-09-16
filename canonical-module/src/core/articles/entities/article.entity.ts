import { randomUUID } from 'node:crypto';

import { ArticleDto } from '@/core/articles/dto/article.dto';
import { ArticleAlreadyPublishedError } from '@/core/articles/articles.errors';
import { Article, ArticleSchema, CreateArticleInput } from '@/core/articles/schemas/article.schema';

export class ArticleEntity {
  readonly id: Article['id'];
  readonly title: Article['title'];
  status: Article['status'];
  readonly createdAt: Article['createdAt'];
  publishedAt: Article['publishedAt'];

  private constructor(article: Article) {
    this.id = article.id;
    this.title = article.title;
    this.status = article.status;
    this.createdAt = article.createdAt;
    this.publishedAt = article.publishedAt;
  }

  static create(input: CreateArticleInput, now = new Date()): ArticleEntity {
    return new ArticleEntity({
      id: randomUUID(),
      title: input.title,
      status: 'DRAFT',
      createdAt: now,
      publishedAt: null,
    });
  }

  static restore(input: unknown): ArticleEntity {
    return new ArticleEntity(ArticleSchema.parse(input));
  }

  publish(now = new Date()): void {
    if (this.status === 'PUBLISHED') throw new ArticleAlreadyPublishedError();
    this.status = 'PUBLISHED';
    this.publishedAt = now;
  }

  toDto(): ArticleDto {
    return {
      id: this.id,
      title: this.title,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      publishedAt: this.publishedAt?.toISOString() ?? null,
    };
  }
}
