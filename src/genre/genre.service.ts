import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BookGenre } from './entities/book_genre.entity';
import { EntityRepository } from '@mikro-orm/core';
import { Genre } from './entities/genre.entity';
import { GenreItem } from './dto/get-all-genre-response';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(BookGenre)
    private readonly bookGenreRepository: EntityRepository<BookGenre>,
    @InjectRepository(Genre)
    private readonly genreRepository: EntityRepository<Genre>,
  ) {}

  async getAllGenre(): Promise<GenreItem[]> {
    const genres = await this.genreRepository.findAll();

    return genres?.map((item) => ({
      label: item?.name,
      value: item?.id,
    }));
  }

  async findGenresByBookId(bookId: number): Promise<Genre[]> {
    const bookGenres = await this.bookGenreRepository.find(
      { book: { id: bookId } },
      { populate: ['genre'] },
    );

    if (bookGenres?.length === 0) {
      return [];
    }

    return bookGenres?.map((bg) => bg.genre) || [];
  }

  async findAllBookByGenreId(
    genreId: string,
    excludeBookId?: number,
  ): Promise<number[]> {
    const genreIds = genreId
      ? genreId.split(',').map((id) => parseInt(id.trim(), 10))
      : [];

    if (genreIds.length === 0) {
      throw new Error('Genre IDs are required');
    }

    const bookGenres = await this.bookGenreRepository.find(
      { genre: { id: { $in: genreIds } } },
      { populate: ['book'] },
    );

    const bookIds = bookGenres.map((bg) => bg.book.id);

    // Exclude the book with the provided book_id if available
    const filteredBookIds = bookIds.filter((id) => id !== excludeBookId);

    return [...new Set(filteredBookIds)];
  }
}
