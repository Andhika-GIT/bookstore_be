import { User } from '@/user/entities/user.entity';
import {
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Entity,
} from '@mikro-orm/core';
import { OrderItem } from './order_item';

@Entity()
export class Order {
  @PrimaryKey()
  id!: number;

  @Property()
  order_id!: string;

  @Property()
  total_price!: number;

  @Property()
  status!: string;

  @OneToMany(() => OrderItem, (item) => item.order, { orphanRemoval: true })
  items = new Collection<OrderItem>(this);

  @ManyToOne({
    fieldName: 'user',
  })
  user!: User;
}
