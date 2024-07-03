import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async findAll(@Query('page') page: string): Promise<Book[]> {
    const pageNumber = parseInt(page, 10) || 1;
    return this.bookService.findAll(pageNumber);
  }
}
