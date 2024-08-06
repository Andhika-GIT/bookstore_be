import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { BookFactory } from '@/factories/book.factory';
import { GenreFactory } from '@/factories/genre.factory';
import { BookGenreFactory } from '@/factories/book_genre.factory';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Create genres
    const genres = await new GenreFactory(em).make(5);

    // Create books
    const books = await new BookFactory(em).make(40);
    
    await Promise.all(
      books.map(async (book) => {
        // Generate a random number of genres (between 1 to 4)
        const numGenres = Math.floor(Math.random() * 4) + 1; // 1 to 4 genres
        const selectedGenres = genres.sort(() => 0.5 - Math.random()).slice(0, numGenres);

        const bookGenreFactory = new BookGenreFactory(em);
        const bookGenres = await bookGenreFactory.makeWithRelations(book, selectedGenres);
        
        // Persist all book-genre relations
        bookGenres.forEach((bg) => em.persist(bg));
      })
    );

    await em.flush();
  }
}
