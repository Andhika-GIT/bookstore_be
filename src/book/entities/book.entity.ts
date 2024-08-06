import { BookGenre } from '@/genre/entities/book_genre.entity';
import { PrimaryKey, Entity, Property, OneToOne } from '@mikro-orm/core';


@Entity()
export class Book {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property()
  img_url!: string;

  @Property()
  author!: string;

  @Property()
  publisher!: string;

  @Property({ type: 'text' })
  description!: string;

  @Property()
  rating!: string;

  @Property({ type: 'numeric' })
  total_page!: number;

  @Property()
  publication_date!: string;

  @Property({type: 'float'})
  price!: number;

  @Property({ defaultRaw: 'now()', nullable: true })
  created_at: Date = new Date();

  @Property({
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
    nullable: true,
  })
  updated_at: Date = new Date();

  @Property({ type: 'numeric' })
  quantity!: number;


}
