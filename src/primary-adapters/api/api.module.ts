import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { config } from '@/config/config';
import { HealthController } from '@/primary-adapters/api/controllers/health.controller';
import { getPostgresConnectionOptions } from '@/secondary-adapters/postgres/postgres-connection-options';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: config.app.node_env === 'production' ? 'info' : 'debug',
      },
    }),
    TypeOrmModule.forRoot(getPostgresConnectionOptions(config)),
  ],
  controllers: [HealthController],
})
export class ApiModule {}
