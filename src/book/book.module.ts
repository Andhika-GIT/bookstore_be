import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Book } from './entities/book.entity';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { GenreModule } from '@/genre/genre.module';

@Module({
  imports: [MikroOrmModule.forFeature([Book]), CloudinaryModule, GenreModule],
  providers: [BookService],
  controllers: [BookController],
  exports: [BookService, MikroOrmModule],
})
export class BookModule {}
