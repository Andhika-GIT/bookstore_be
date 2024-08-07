import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { UserRequestDto } from './user-request';
import { ItemsRequestDto } from './items-request';

export class CreateTransactionRequestDto {
  @IsNotEmpty()
  @IsNumber()
  total_price: number;

  @IsNotEmpty()
  @IsObject()
  @Type(() => UserRequestDto)
  user: UserRequestDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ItemsRequestDto)
  items: ItemsRequestDto[];
}
