import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BookGenre } from './entities/book_genre.entity';
import { EntityRepository } from '@mikro-orm/core';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(BookGenre)
        private readonly bookGenreRepository: EntityRepository<BookGenre>
    ){}
   
    async findGenresByBookId(bookId: number): Promise<Genre[]> {
        const bookGenres = await this.bookGenreRepository.find(
            { book: { id: bookId } },
            { populate: ['genre'] } 
        );

        if (bookGenres?.length === 0) {
            return []; 
        }

        return bookGenres?.map(bg => bg.genre) || [];
    }
}
