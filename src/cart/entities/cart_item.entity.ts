import { PrimaryKey, Property, Entity, ManyToOne } from '@mikro-orm/core';
import { Cart } from './cart.entity';
import { Book } from '@/book/entities/book.entity';

@Entity()
export class CartItem {
  @PrimaryKey()
  id: number;

  @ManyToOne({
    fieldName: 'cart_id',
  })
  cart_id!: Cart;

  @ManyToOne({
    fieldName: 'book_id',
  })
  book_id!: Book;

  @Property()
  quantity!: number;
}
