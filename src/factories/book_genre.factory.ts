import { Factory } from '@mikro-orm/seeder';
import { BookGenre } from '@/genre/entities/book_genre.entity';
import { Book } from '@/book/entities/book.entity';
import { Genre } from '@/genre/entities/genre.entity';


export class BookGenreFactory extends Factory<BookGenre> {
  model = BookGenre;

  definition(): Partial<BookGenre> {
    return {};
  }

  async makeWithRelations(book: Book, genres: Genre[]): Promise<BookGenre[]> {
    const bookGenres: BookGenre[] = [];
    
    for (const genre of genres) {
      const bookGenre = this.makeOne(); // Buat entri baru untuk setiap genre
      bookGenre.book = book;
      bookGenre.genre = genre;
      bookGenres.push(bookGenre);
    }
    
    return bookGenres;
  }
  
  
}
