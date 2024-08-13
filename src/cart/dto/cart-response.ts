import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDto } from './cart-item';

export class CartResponseDto {
  @IsNumber()
  cart_id: number;

  @IsNumber()
  total_price: number;

  @IsNumber()
  total_items: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
