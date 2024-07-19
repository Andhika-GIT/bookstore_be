import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  publisher: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  rating: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  total_page: number;

  @IsNotEmpty()
  @IsString()
  publication_date: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  quantity: number;
}
