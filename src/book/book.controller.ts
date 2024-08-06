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
import { Response } from 'express';
import { CreateBookDto } from './dto/create-book';
import { sendResponse } from '@/common/utils/response.util';
import { UseFileInterceptor } from '@/interceptors/file.interceptor';
import { GenreService } from '@/genre/genre.service';

@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly genreService: GenreService
  ) {}

  @Get()
  async findAll(@Query('page') page: string, @Res() res: Response) {
    const pageNumber = parseInt(page, 10) || 1;

    try {
      const { books, nextPage } = await this.bookService.findAll(pageNumber);

      sendResponse(res, 200, 'Sucessfully retrieved all books', {
        totalData: books?.length,
        nextPage: nextPage,
        books: books,
      });
    } catch (e) {
      sendResponse(res, 500, e.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const genres = await this.genreService.findGenresByBookId(id)
    const genresNameString = genres?.map(genre => genre?.name)?.join(', ') || '';
    const book = await this.bookService.findOne(id);

    sendResponse(res, 200, 'Succesfully retrieve book', {
      ...book,
      genres: genresNameString
    });
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
