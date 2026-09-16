import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  ArticleAlreadyPublishedError,
  ArticleNotFoundError,
} from '@/core/articles/articles.errors';
import { ArticleListQueryDto, ArticleListResponseDto } from '@/core/articles/dto/article-read.dto';
import { ArticleDto, CreateArticleDto } from '@/core/articles/dto/article.dto';
import { CreateArticleUseCase } from '@/core/articles/use-cases/create-article.use-case';
import { GetArticleUseCase } from '@/core/articles/use-cases/get-article.use-case';
import { ListArticlesUseCase } from '@/core/articles/use-cases/list-articles.use-case';
import { PublishArticleUseCase } from '@/core/articles/use-cases/publish-article.use-case';

@ApiTags('Articles')
@Controller('/v1/articles')
export class ArticleController {
  constructor(
    private readonly createArticle: CreateArticleUseCase,
    private readonly getArticle: GetArticleUseCase,
    private readonly listArticles: ListArticlesUseCase,
    private readonly publishArticle: PublishArticleUseCase,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: ArticleDto })
  async create(@Body() input: CreateArticleDto): Promise<ArticleDto> {
    return (await this.createArticle.execute(input)).toDto();
  }

  @Get()
  @ApiOkResponse({ type: ArticleListResponseDto })
  async findPage(@Query() query: ArticleListQueryDto): Promise<ArticleListResponseDto> {
    return this.listArticles.execute(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleDto })
  @ApiNotFoundResponse({ type: ArticleNotFoundError })
  async findOne(@Param('id') id: string): Promise<ArticleDto> {
    return (await this.getArticle.execute(id)).toDto();
  }

  @Post(':id/publish')
  @ApiOkResponse({ type: ArticleDto })
  @ApiNotFoundResponse({ type: ArticleNotFoundError })
  @ApiBadRequestResponse({ type: ArticleAlreadyPublishedError })
  async publish(@Param('id') id: string): Promise<ArticleDto> {
    return (await this.publishArticle.execute(id)).toDto();
  }
}
