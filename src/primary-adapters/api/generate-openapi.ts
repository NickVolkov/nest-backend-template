import fs from 'node:fs/promises';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { dump } from 'js-yaml';

import { createOpenApiDocument } from '@/primary-adapters/api/openapi';
import { OpenApiGeneratorModule } from '@/primary-adapters/api/openapi-generator.module';

async function generate(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    OpenApiGeneratorModule,
    new FastifyAdapter(),
    { logger: false },
  );
  app.setGlobalPrefix('api');
  const document = createOpenApiDocument(app);
  await fs.writeFile('openapi.yaml', dump(document, { noRefs: true, lineWidth: 120 }));
  await app.close();
}

void generate();
