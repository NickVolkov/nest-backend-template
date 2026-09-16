import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleReadRepository } from '@/core/articles/repository/article-read.repository';
import { ArticleRepository } from '@/core/articles/repository/article.repository';
import { ArticleEntityDB } from '@/secondary-adapters/postgres/entities/article.entity';
import { ArticleReadInPostgresRepository } from '@/secondary-adapters/postgres/repository/article-read-in-postgres.repository';
import { ArticleInPostgresRepository } from '@/secondary-adapters/postgres/repository/article-in-postgres.repository';

const repositories = [
  { provide: ArticleRepository, useClass: ArticleInPostgresRepository },
  { provide: ArticleReadRepository, useClass: ArticleReadInPostgresRepository },
];

@Module({})
export class ArticlePostgresModule {
  static register(): DynamicModule {
    return {
      module: ArticlePostgresModule,
      imports: [TypeOrmModule.forFeature([ArticleEntityDB])],
      providers: repositories,
      exports: repositories.map(({ provide }) => provide),
    };
  }
}
