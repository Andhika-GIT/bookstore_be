import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Book } from './entities/book.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Book])],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
