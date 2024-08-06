import { Book } from './book/entities/book.entity';
import { User } from './user/entities/user.entity';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cart_item.entity';
import { Genre } from './genre/entities/genre.entity';
import { BookGenre } from './genre/entities/book_genre.entity';

export const entities = [Book, User, Cart, CartItem, Genre, BookGenre];
