import { PrimaryKey, Property, Entity, ManyToOne } from '@mikro-orm/core';
import { Cart } from './cart.entity';
import { Book } from '@/book/entities/book.entity';

@Entity()
export class CartItem {
  @PrimaryKey()
  id: number;

  @ManyToOne()
  cart_id!: Cart;

  @ManyToOne()
  book_id!: Book;

  @Property()
  quantity!: number;
}
