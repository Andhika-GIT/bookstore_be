import { PrimaryKey, Property, Entity, ManyToOne } from '@mikro-orm/core';
import { Cart } from './cart.entity';
import { Book } from '@/book/entities/book.entity';

@Entity()
export class CartItem {
  @PrimaryKey()
  id: number;

  @ManyToOne({
    fieldName: 'cart',
  })
  cart!: Cart;

  @ManyToOne({
    fieldName: 'book',
  })
  book!: Book;

  @Property()
  quantity!: number;
}
