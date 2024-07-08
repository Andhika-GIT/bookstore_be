import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsString()
  imgURL: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;
}
