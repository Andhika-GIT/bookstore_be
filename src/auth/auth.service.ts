import { CreateUserDto } from '@/user/dto/create-user';
import { BadRequestException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { setCookie } from '@/utils/cookie.util';
import { Response } from 'express';
import { SignInUserDto } from './dto/signIn-user';
import { hashPassword } from '@/utils/hash-password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(user: SignInUserDto, response: Response) {
    const currentUser = await this.userService.findUser(user?.username);
  }

  async signUp(user: CreateUserDto, response: Response) {
    const currentUser = await this.userService.findByEmail(user?.email);

    if (currentUser) {
      throw new BadRequestException('Email already used');
    }

    const hashedPassword = await hashPassword(user?.password);

    const newUser: CreateUserDto = {
      ...user,
      password: hashedPassword,
    };

    await this.userService.create(newUser);

    setCookie(response, 'jwt', this.jwtService.sign({ email: user.email }));
  }
}
