import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }
}
