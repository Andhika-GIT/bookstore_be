import { IsString, IsNotEmpty } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
