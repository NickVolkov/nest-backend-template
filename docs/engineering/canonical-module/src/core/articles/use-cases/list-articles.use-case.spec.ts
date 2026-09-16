import { ArticleReadRepository } from '@/core/articles/repository/article-read.repository';
import { ListArticlesUseCase } from '@/core/articles/use-cases/list-articles.use-case';

describe('ListArticlesUseCase', () => {
  it('requests a page projection and adds pagination metadata', async () => {
    const findPage: ArticleReadRepository['findPage'] = jest.fn().mockResolvedValue({
      items: [
        {
          id: '48ce05a2-a82a-45d6-944f-23c2d8d067c7',
          title: 'Read models',
          status: 'PUBLISHED',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      total: 3,
    });
    const repository: ArticleReadRepository = { findPage };

    const response = await new ListArticlesUseCase(repository).execute({
      page: 2,
      limit: 1,
      statuses: ['PUBLISHED'],
    });

    expect(findPage).toHaveBeenCalledWith({
      offset: 1,
      limit: 1,
      statuses: ['PUBLISHED'],
    });
    expect(response.meta).toEqual({ page: 2, limit: 1, total: 3, hasNext: true });
  });
});
