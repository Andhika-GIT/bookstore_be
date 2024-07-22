import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Res,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';

import { Response } from 'express';
import { User } from '@/user/entities/user.entity';
import { CreateUserDto } from './dto/create-user';
import { UseSerializeInterceptor } from '@/interceptors/serialize.interceptor';
import { UserResponseDto } from './dto/userResponse-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  @UseGuards(LocalGuard)
  signIn(@Request() req: { user: User }, @Res() res: Response) {
    return this.authService.signIn(req.user, res);
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post('signUp')
  signUp(@Body() body: CreateUserDto, @Res() res: Response) {
    return this.authService.signUp(body, res);
  }

  @UseSerializeInterceptor(UserResponseDto)
  @Get('my-info')
  @UseGuards(JwtGuard)
  getMyInfo(@Request() req: { user: User }) {
    return req.user;
  }
}
