import { IsString, IsNumber } from 'class-validator';

export class UserOrderHistoryResponseDto {
  @IsString()
  order_id: string;

  @IsNumber()
  total_items: number;

  @IsString()
  order_status: string;
}
