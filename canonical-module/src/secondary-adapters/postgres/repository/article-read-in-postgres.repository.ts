import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ArticleSummary,
  ArticleSummaryProjection,
} from '@/core/articles/schemas/article-read.schema';
import {
  ArticleReadRepository,
  ArticlesPage,
  FindArticlesPageInput,
} from '@/core/articles/repository/article-read.repository';
import { ArticleEntityDB } from '@/secondary-adapters/postgres/entities/article.entity';

@Injectable()
export class ArticleReadInPostgresRepository implements ArticleReadRepository {
  constructor(
    @InjectRepository(ArticleEntityDB)
    private readonly rows: Repository<ArticleEntityDB>,
  ) {}

  async findPage(input: FindArticlesPageInput): Promise<ArticlesPage> {
    const query = this.rows
      .createQueryBuilder('article')
      .orderBy('article.createdAt', 'DESC')
      .addOrderBy('article.id', 'DESC')
      .skip(input.offset)
      .take(input.limit);

    if (input.statuses?.length) {
      query.andWhere('article.status IN (:...statuses)', { statuses: input.statuses });
    }

    const [rows, total] = await query.getManyAndCount();
    return { items: rows.map((row) => this.toSummary(row)), total };
  }

  private toSummary(row: ArticleEntityDB): ArticleSummary {
    return ArticleSummaryProjection.parse({
      id: row.id,
      title: row.title,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    });
  }
}
