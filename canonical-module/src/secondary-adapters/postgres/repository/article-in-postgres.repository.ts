import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArticleEntity } from '@/core/articles/entities/article.entity';
import { ArticleRepository } from '@/core/articles/repository/article.repository';
import { ArticleEntityDB } from '@/secondary-adapters/postgres/entities/article.entity';

@Injectable()
export class ArticleInPostgresRepository implements ArticleRepository {
  constructor(
    @InjectRepository(ArticleEntityDB)
    private readonly rows: Repository<ArticleEntityDB>,
  ) {}

  async findById(id: string): Promise<ArticleEntity | null> {
    const row = await this.rows.findOne({ where: { id } });
    return row ? ArticleEntity.restore(row) : null;
  }

  async save(article: ArticleEntity): Promise<void> {
    await this.rows.save({
      id: article.id,
      title: article.title,
      status: article.status,
      createdAt: article.createdAt,
      publishedAt: article.publishedAt,
    });
  }
}
