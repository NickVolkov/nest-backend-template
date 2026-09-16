import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';

describe('PostgreSQL foundation', () => {
  let container: StartedPostgreSqlContainer;
  let dataSource: DataSource;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:17-alpine').start();
    dataSource = new DataSource({ type: 'postgres', url: container.getConnectionUri() });
    await dataSource.initialize();
  }, 120_000);

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
    if (container) await container.stop();
  });

  it('connects to a real PostgreSQL server', async () => {
    await expect(dataSource.query('SELECT 1 AS value')).resolves.toEqual([{ value: 1 }]);
  });
});
