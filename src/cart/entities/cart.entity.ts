import { User } from '@/user/entities/user.entity';
import { CartItem } from './cart_item.entity';
import {
  PrimaryKey,
  Property,
  Entity,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';

@Entity()
export class Cart {
  @PrimaryKey()
  id: number;

  @ManyToOne({
    fieldName: 'user_id',
  })
  user_id!: User;

  @OneToMany({ mappedBy: 'cart_id' })
  items = new Collection<CartItem>(this);

  @Property({ defaultRaw: 'now()', nullable: true })
  created_at: Date = new Date();

  @Property({
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
    nullable: true,
  })
  updated_at: Date = new Date();
}
