import { DynamicModule, Module, Type } from '@nestjs/common';

import { CreateArticleUseCase } from '@/core/articles/use-cases/create-article.use-case';
import { GetArticleUseCase } from '@/core/articles/use-cases/get-article.use-case';
import { PublishArticleUseCase } from '@/core/articles/use-cases/publish-article.use-case';

const useCases = [CreateArticleUseCase, GetArticleUseCase, PublishArticleUseCase];

@Module({})
export class ArticlesCoreModule {
  static register(imports: Array<DynamicModule | Type> = []): DynamicModule {
    return {
      module: ArticlesCoreModule,
      imports,
      providers: useCases,
      exports: useCases,
    };
  }
}
