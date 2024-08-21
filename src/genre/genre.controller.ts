import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { GenreService } from './genre.service';
import { Response } from 'express';
import { sendResponse } from '@/common/utils/response.util';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async getAllGenre(@Res() res: Response) {
    const formattedGenres = await this.genreService.getAllGenre();

    sendResponse(
      res,
      HttpStatus.OK,
      'Successfully get all genres',
      formattedGenres,
    );
  }
}
