import { ErrorDto } from '@/error';

export class ArticleNotFoundError extends ErrorDto({
  name: 'ArticleNotFoundError',
  status: 404,
  message: 'Article not found',
}) {}

export class ArticleAlreadyPublishedError extends ErrorDto({
  name: 'ArticleAlreadyPublishedError',
  status: 400,
  message: 'Article is already published',
}) {}
