import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Genre {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

}
