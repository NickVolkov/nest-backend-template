import { ArticleEntity } from '@/core/articles/entities/article.entity';
import { ArticleRepository } from '@/core/articles/repository/article.repository';
import { CreateArticleUseCase } from '@/core/articles/use-cases/create-article.use-case';

describe('CreateArticleUseCase', () => {
  it('creates and persists an article', async () => {
    const save = jest.fn<Promise<void>, [ArticleEntity]>().mockResolvedValue();
    const repository: ArticleRepository = {
      findById: jest.fn(),
      save,
    };

    const article = await new CreateArticleUseCase(repository).execute({ title: 'Ports' });

    expect(article.toDto()).toMatchObject({ title: 'Ports', status: 'DRAFT' });
    expect(save).toHaveBeenCalledWith(article);
  });
});
