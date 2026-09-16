import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly adapters: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const error = exception instanceof Error ? exception : new Error('Unknown error');
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : typeof exception === 'object' &&
            exception !== null &&
            'status' in exception &&
            typeof exception.status === 'number'
          ? exception.status
          : HttpStatus.INTERNAL_SERVER_ERROR;

    this.adapters.httpAdapter.reply(
      context.getResponse(),
      {
        statusCode: status,
        name: error.name,
        message: error.message,
        timestamp: new Date().toISOString(),
        path: this.adapters.httpAdapter.getRequestUrl(context.getRequest()),
      },
      status,
    );
  }
}
