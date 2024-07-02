import { PrimaryKey, Entity, Property } from '@mikro-orm/core';

@Entity()
export class Book {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property()
  imgURL!: string;

  @Property()
  author!: string;

  @Property()
  publisher!: string;

  @Property({ type: 'text' })
  description!: string;

  @Property()
  rating!: string;

  @Property()
  total_page!: number;

  @Property()
  publication_date!: string;
}
