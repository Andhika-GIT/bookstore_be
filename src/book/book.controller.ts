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
import { Book } from './entities/book.entity';

@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly genreService: GenreService,
  ) {}

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('query') query?: string,
    @Query('filter') filter?: string,
    @Query('genre') genre?: string,
    @Query('page') page?: number,
  ) {
    const pageSize = 8;
    const pageNumber = page || 1;

    try {
      let books: Book[];
      let nextPage: number;

      if (genre) {
        // Get all book IDs based on genre IDs
        const bookIds = await this.genreService.findAllBookByGenreId(genre);

        // Get all books data based on book IDs
        ({ books, nextPage } = await this.bookService.findAllByIds(
          bookIds,
          pageSize,
          pageNumber,
          filter,
          query,
        ));
      } else {
        // Get all books data without filtering by genre
        ({ books, nextPage } = await this.bookService.findAll(
          pageNumber,
          filter,
          query,
        ));
      }

      sendResponse(res, 200, 'Successfully retrieved books', {
        totalData: books.length,
        nextPage: nextPage,
        books: books,
      });
    } catch (e) {
      sendResponse(res, 500, e.message);
    }
  }

  @Get('related/:id')
  async findRelated(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.bookService.findOne(id);

    const genres = await this.genreService.findGenresByBookId(id);

    const genreIds =
      genres
        ?.map((genre) => genre?.id)
        ?.join(',')
        ?.toString() || '';

    const bookIds = await this.genreService.findAllBookByGenreId(genreIds, id);

    const { books } = await this.bookService.findAllByIds(bookIds, 3, 1);

    sendResponse(res, 200, 'success', {
      genre: genreIds,
      books: books,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const genres = await this.genreService.findGenresByBookId(id);
    const genresNameString =
      genres?.map((genre) => genre?.name)?.join(', ') || '';
    const book = await this.bookService.findOne(id);

    sendResponse(res, 200, 'Succesfully retrieve book', {
      ...book,
      genres: genresNameString,
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
