import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Book } from '@/book/entities/book.entity';
import bookData from '@/common/dummy/book.json';
import { GenreFactory } from '@/factories/genre.factory';
import { faker } from '@faker-js/faker';
import { BookGenreFactory } from '@/factories/book_genre.factory';
import { UserFactory } from '@/factories/user.factory';
import { hashPassword } from '@/common/utils/password.util';
import { User } from '@/user/entities/user.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Create user
    const userFactory = new UserFactory(em);
    const userData = userFactory.definition();

    // Hash the password
    userData.password = await hashPassword('hubla');

    const user = new User();
    Object.assign(user, userData);
    em.persist(user);

    // Create genres
    const genres = await new GenreFactory(em).make(5);

    // Create books
    const books = bookData.map((book) => {
      const bookEntity = new Book();
      bookEntity.title = book.title;
      bookEntity.author = book.author;
      bookEntity.publisher = book.publisher;
      bookEntity.description = book.description;
      bookEntity.img_url =
        'https://images.unsplash.com/photo-1537495329792-41ae41ad3bf0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      (bookEntity.rating = faker.datatype
        .number({ min: 1, max: 5 })
        .toString()),
        (bookEntity.total_page = faker.datatype.number({ min: 100, max: 500 })),
        (bookEntity.publication_date = faker.date
          .past()
          .toISOString()
          .split('T')[0]),
        (bookEntity.price = faker.datatype.number({ min: 10, max: 100 })),
        (bookEntity.quantity = faker.datatype.number({ min: 50, max: 100 }));

      return bookEntity;
    });

    books.forEach((book) => em.persist(book));

    await Promise.all(
      books.map(async (book) => {
        // Generate a random number of genres (between 1 to 4)
        const numGenres = Math.floor(Math.random() * 4) + 1; // 1 to 4 genres
        const selectedGenres = genres
          .sort(() => 0.5 - Math.random())
          .slice(0, numGenres);

        const bookGenreFactory = new BookGenreFactory(em);
        const bookGenres = await bookGenreFactory.makeWithRelations(
          book,
          selectedGenres,
        );

        // Persist all book-genre relations
        bookGenres.forEach((bg) => em.persist(bg));
      }),
    );

    await em.flush();
  }
}
