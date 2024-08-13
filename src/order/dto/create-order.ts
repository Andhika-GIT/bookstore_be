import { User } from '@/user/entities/user.entity';
import { CartItemDto } from '@/cart/dto';
import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  order_id!: string;

  @IsNumber()
  total_price!: number;

  @IsString()
  status!: string;

  user!: User;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
