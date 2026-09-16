import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { config } from '@/config/config';
import { getPostgresDataSourceOptions } from '@/secondary-adapters/postgres/postgres-connection-options';

export default new DataSource(getPostgresDataSourceOptions(config));
