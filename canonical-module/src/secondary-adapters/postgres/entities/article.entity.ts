import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntityDB {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar' })
  status!: string;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt!: Date | null;
}
