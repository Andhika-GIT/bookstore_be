import { PrimaryKey, Property, Entity } from '@mikro-orm/core';

@Entity()
export class Cart {
  @PrimaryKey()
  id: number;

  @Property()
  user_id!: number;

  @Property()
  book_id!: number;

  @Property({ defaultRaw: 'now()', nullable: true })
  created_at: Date = new Date();

  @Property({
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
    nullable: true,
  })
  updated_at: Date = new Date();
}
