import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';

class BookOrderItem {
  @IsString()
  book_id!: number;

  @IsNumber()
  book_price!: number;

  @IsString()
  book_name!: string;

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

  @IsOptional()
  @IsString()
  payment_type: string;

  @IsOptional()
  @IsString()
  va_number: string;

  @IsOptional()
  @IsString()
  bank: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookOrderItem)
  items: BookOrderItem[];
}
