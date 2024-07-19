import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UploadedFile,
  Post,
  Res,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { Response } from 'express';
import { CreateBookDto } from './dto/create-book';
import { sendResponse } from '@/common/utils/response.util';
import { UseFileInterceptor } from '@/interceptors/file.interceptor';

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

  @UseFileInterceptor('img_url') // Custom decorator for file upload with correct key
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post()
  async createBook(
    @Res() res: Response,
    @Body() newBookData: CreateBookDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (!file) {
        // File is required but not provided
        return sendResponse(res, 400, 'Image file is required.');
      }
      await this.bookService.createBook(newBookData, file);

      sendResponse(res, 201, 'Successfully created book');
    } catch (e) {
      sendResponse(res, 500, e.message);
    }
  }
}
