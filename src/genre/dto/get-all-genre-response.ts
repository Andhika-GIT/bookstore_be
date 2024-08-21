import { IsArray, IsString } from 'class-validator';

export class GenreItem {
  @IsString()
  label: string;

  @IsString()
  value: number;
}
