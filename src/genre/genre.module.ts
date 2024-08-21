import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Genre } from './entities/genre.entity';
import { BookGenre } from './entities/book_genre.entity';
import { GenreController } from './genre.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Genre, BookGenre])],
  providers: [GenreService],
  exports: [GenreService, MikroOrmModule],
  controllers: [GenreController]
})
export class GenreModule {}
