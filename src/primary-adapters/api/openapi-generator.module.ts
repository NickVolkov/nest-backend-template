import { Module } from '@nestjs/common';

import { HealthController } from '@/primary-adapters/api/controllers/health.controller';

@Module({ controllers: [HealthController] })
export class OpenApiGeneratorModule {}
