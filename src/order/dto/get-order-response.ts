import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';

class BookOrderItem {
  @IsString()
  book_id!: number;

  @IsNumber()
  book_price!: number;

  @IsString()
  img_url!: string;

  @IsNumber()
  order_quantity!: number;
}

export class GetOrderResponseDto {
  @IsString()
  order_id!: string;

  @IsNumber()
  total_price!: number;

  @IsString()
  status!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookOrderItem)
  items: BookOrderItem[];
}
