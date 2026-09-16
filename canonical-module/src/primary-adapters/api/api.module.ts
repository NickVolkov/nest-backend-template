import { Module } from '@nestjs/common';

import { ArticlesCoreModule } from '@/core/articles/articles.module';
import { ArticleController } from '@/primary-adapters/api/controllers/article.controller';
import { ArticlePostgresModule } from '@/secondary-adapters/postgres/article-postgres.module';

const articlePostgres = ArticlePostgresModule.register();
const articles = ArticlesCoreModule.register([articlePostgres]);

@Module({
  imports: [articles],
  controllers: [ArticleController],
})
export class ApiModule {}
