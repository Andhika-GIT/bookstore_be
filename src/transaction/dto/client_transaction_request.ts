import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDto } from '@/cart/dto';

export class ClientTransactionRequestDto {
  @IsNotEmpty()
  @IsNumber()
  total_price: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
