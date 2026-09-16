import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleRepository } from '@/core/articles/repository/article.repository';
import { ArticleEntityDB } from '@/secondary-adapters/postgres/entities/article.entity';
import { ArticleInPostgresRepository } from '@/secondary-adapters/postgres/repository/article-in-postgres.repository';

@Module({})
export class ArticlePostgresModule {
  static register(): DynamicModule {
    return {
      module: ArticlePostgresModule,
      imports: [TypeOrmModule.forFeature([ArticleEntityDB])],
      providers: [{ provide: ArticleRepository, useClass: ArticleInPostgresRepository }],
      exports: [ArticleRepository],
    };
  }
}
