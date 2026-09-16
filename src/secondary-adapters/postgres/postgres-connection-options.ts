import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import { AppConfig } from '@/config/config';

export function getPostgresConnectionOptions(config: AppConfig): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: config.database.url,
    autoLoadEntities: true,
    logging: config.database.log,
    migrationsRun: config.database.run_migrations,
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    synchronize: false,
  };
}

export function getPostgresDataSourceOptions(config: AppConfig): DataSourceOptions {
  return {
    type: 'postgres',
    url: config.database.url,
    entities: [`${__dirname}/entities/*{.ts,.js}`],
    logging: config.database.log,
    migrationsRun: config.database.run_migrations,
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    synchronize: false,
  };
}
