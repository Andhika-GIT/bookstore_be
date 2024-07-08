import { PrimaryKey, Entity, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  username!: string;

  @Property()
  password!: string;

  @Property()
  imageURL: string;

  @Property()
  email: string;

  @Property({ type: 'text' })
  address: string;

  @Property()
  phone_number: string;
}
