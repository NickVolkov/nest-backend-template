import helmet from '@fastify/helmet';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { ZodValidationPipe } from 'nestjs-zod';

import { config } from '@/config/config';
import { ApiModule } from '@/primary-adapters/api/api.module';
import { GlobalExceptionFilter } from '@/primary-adapters/api/filters/global-exception.filter';
import { setupSwagger } from '@/primary-adapters/api/openapi';

export async function bootstrapApi(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(ApiModule, new FastifyAdapter(), {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  await app.register(helmet);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(HttpAdapterHost)));
  app.enableShutdownHooks();
  setupSwagger(app);

  await app.listen(config.apps.api.port, '0.0.0.0');
}
