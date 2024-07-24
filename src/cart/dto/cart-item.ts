// src/cart/dto/cart-item-response.dto.ts
import { IsInt, IsNotEmpty, IsUrl, Min } from 'class-validator';

export class CartItemDto {
  @IsInt()
  @Min(1)
  book_id: number;

  @IsNotEmpty()
  title: string;

  @IsUrl()
  img_url: string;

  @IsInt()
  @Min(0)
  quantity: number;
}
