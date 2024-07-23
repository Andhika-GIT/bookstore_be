import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCartReqDto {
  @IsNotEmpty()
  @IsNumber()
  book_id: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
