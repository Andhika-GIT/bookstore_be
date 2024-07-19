import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Book } from './entities/book.entity';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [MikroOrmModule.forFeature([Book]), CloudinaryModule],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
