// src/user/dto/user-response.dto.ts
import { Expose } from 'class-transformer';

export class MyInfoResponseDto {
  @Expose()
  username: string;

  @Expose()
  fullname: string;

  @Expose()
  imageURL?: string;

  @Expose()
  email: string;

  @Expose()
  address?: string;

  @Expose()
  phone_number: string;
}
