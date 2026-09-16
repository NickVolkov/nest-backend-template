import { ArticleAlreadyPublishedError } from '@/core/articles/articles.errors';
import { ArticleEntity } from '@/core/articles/entities/article.entity';

describe('ArticleEntity', () => {
  it('creates a draft and publishes it through a guarded transition', () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const publishedAt = new Date('2026-01-02T00:00:00.000Z');
    const article = ArticleEntity.create({ title: 'Canonical modules' }, createdAt);

    article.publish(publishedAt);

    expect(article.toDto()).toEqual({
      id: expect.any(String),
      title: 'Canonical modules',
      status: 'PUBLISHED',
      createdAt: createdAt.toISOString(),
      publishedAt: publishedAt.toISOString(),
    });
    expect(() => article.publish()).toThrow(ArticleAlreadyPublishedError);
  });

  it('rejects untrusted invalid persistence data', () => {
    expect(() => ArticleEntity.restore({ id: 'not-a-uuid' })).toThrow();
  });
});
