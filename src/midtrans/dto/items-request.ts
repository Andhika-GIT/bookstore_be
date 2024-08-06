// id: item.book_name, // Ganti dengan ID yang sesuai jika perlu
// price: item.price,
// quantity: item.quantity,
// name: item.book_name,

import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';

export class ItemsRequestDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
