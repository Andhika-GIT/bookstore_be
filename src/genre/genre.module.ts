import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Genre } from './entities/genre.entity';
import { BookGenre } from './entities/book_genre.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Genre, BookGenre])],
  providers: [GenreService],
  exports: [GenreService, MikroOrmModule]
})
export class GenreModule {}
