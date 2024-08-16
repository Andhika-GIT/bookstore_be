import { Book } from '@/book/entities/book.entity';
import { IsString, IsNumber, IsArray, IsObject } from 'class-validator';

class OrderHistoryItems {
  @IsString()
  order_id: string;

  @IsNumber()
  total_items: number;

  @IsString()
  order_status: string;

  @IsObject()
  first_item: Book;
}

export class UserOrderHistoryResponseDto {
  total_page: number;

  next_page: number;

  items: OrderHistoryItems[];
}
