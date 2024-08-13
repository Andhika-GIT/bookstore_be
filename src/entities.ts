import { Book } from './book/entities/book.entity';
import { User } from './user/entities/user.entity';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cart_item.entity';
import { Genre } from './genre/entities/genre.entity';
import { BookGenre } from './genre/entities/book_genre.entity';
import { Order } from './order/entities/order';
import { OrderItem } from './order/entities/order_item';

export const entities = [
  Book,
  User,
  Cart,
  CartItem,
  Genre,
  BookGenre,
  Order,
  OrderItem,
];
