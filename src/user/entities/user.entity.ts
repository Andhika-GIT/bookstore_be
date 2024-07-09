import { PrimaryKey, Entity, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  username!: string;

  @Property()
  password!: string;

  @Property({ nullable: true })
  imageURL: string;

  @Property()
  email!: string;

  @Property({ type: 'text', nullable: true })
  address: string;

  @Property()
  phone_number: string;

  @Property({ defaultRaw: 'now()', nullable: true })
  created_at: Date;

  @Property({ defaultRaw: 'now()', onUpdate: () => new Date(), nullable: true })
  updated_at: Date;
}
