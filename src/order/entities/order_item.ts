import { Book } from '@/book/entities/book.entity';
import { Order } from './order';
import {
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Entity,
} from '@mikro-orm/core';

@Entity()
export class OrderItem {
  @PrimaryKey()
  id!: number;

  @ManyToOne({
    fieldName: 'order',
  })
  order!: Order;

  @ManyToOne({
    fieldName: 'book',
  })
  book!: Book;

  @Property()
  quantity!: number;

  @Property()
  price!: number;
}
