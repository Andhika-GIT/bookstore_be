import { CreateUserDto } from '@/auth/dto/create-user';
import { BadRequestException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { setCookie } from '@/common/utils/cookie.util';
import { Response } from 'express';
import { hashPassword, verifyPassword } from '@/common/utils/password.util';
import { SignInUserDto } from './dto/signIn-user';
import { User } from '@/user/entities/user.entity';
import { sendResponse } from '@/common/utils/response.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(user: SignInUserDto): Promise<User> {
    const findUser = await this.userService.findUser(user?.username);

    if (!findUser) {
      throw new BadRequestException('invalid credential');
    }

    const passwordIncorrect = await verifyPassword(
      user?.password,
      findUser?.password,
    );

    if (passwordIncorrect) {
      throw new BadRequestException('invalid credential');
    }

    return findUser;
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

    return sendResponse(response, 200, 'sucessfully sign up');
  }

  async signIn(user: User, response: Response) {
    setCookie(response, 'jwt', this.jwtService.sign({ email: user.email }));

    return sendResponse(response, 200, 'sucessfully sign up');
  }
}
