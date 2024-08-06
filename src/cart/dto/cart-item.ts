// src/cart/dto/cart-item-response.dto.ts
import { IsInt, IsNotEmpty, IsNumber, IsUrl, Min } from 'class-validator';

export class CartItemDto {
  @IsInt()
  cart_items_id: number;

  @IsInt()
  @Min(1)
  book_id: number;

  @IsNotEmpty()
  title: string;

  @IsUrl()
  img_url: string;

  @IsInt()
  @Min(0)
  book_quantity: number;

  @IsNumber()
  price: number;

  @IsInt()
  @Min(0)
  quantity: number;
}
