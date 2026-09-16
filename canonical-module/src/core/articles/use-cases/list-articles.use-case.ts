import { Injectable } from '@nestjs/common';

import { ArticleListResponseDto } from '@/core/articles/dto/article.dto';
import { ArticleReadRepository } from '@/core/articles/repository/article-read.repository';
import { ArticleStatus } from '@/core/articles/schemas/article.schema';

@Injectable()
export class ListArticlesUseCase {
  constructor(private readonly articles: ArticleReadRepository) {}

  async execute(input: {
    page: number;
    limit: number;
    statuses?: ArticleStatus[];
  }): Promise<ArticleListResponseDto> {
    const { items, total } = await this.articles.findPage({
      offset: (input.page - 1) * input.limit,
      limit: input.limit,
      statuses: input.statuses,
    });

    return {
      items,
      meta: {
        page: input.page,
        limit: input.limit,
        total,
        hasNext: input.page * input.limit < total,
      },
    };
  }
}
