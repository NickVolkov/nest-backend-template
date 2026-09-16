import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateArticles1700000000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'articles',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'title', type: 'varchar' },
          { name: 'status', type: 'varchar' },
          { name: 'created_at', type: 'timestamptz' },
          { name: 'published_at', type: 'timestamptz', isNullable: true },
        ],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('articles');
  }
}
