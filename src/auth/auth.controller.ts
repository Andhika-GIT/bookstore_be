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
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '@/user/entities/user.entity';
import { CreateUserDto } from './dto/create-user';
import { UseSerializeInterceptor, UseFileInterceptor } from '@/interceptors/';
import { UserResponseDto } from './dto/userResponse-user';
import { setCookie } from '@/common/utils/cookie.util';
import { sendResponse } from '@/common/utils/response.util';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signIn')
  @UseGuards(LocalGuard)
  signIn(@Request() req: { user: User }, @Res() res: Response) {
    setCookie(res, 'jwt', this.jwtService.sign({ email: req?.user?.email }));

    return sendResponse(res, 200, 'sucessfully sign in');
  }

  @UseFileInterceptor('img_url') // Custom decorator for file upload with correct key
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post('signUp')
  async signUp(
    @Body() body: CreateUserDto,
    @Res() res: Response,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const newUser = await this.authService.createUser(body, file);

      setCookie(res, 'jwt', this.jwtService.sign({ email: newUser.email }));

      sendResponse(res, 200, 'sucessfully sign up');
    } catch (e) {
      sendResponse(res, 500, e.message);
    }
  }

  @UseSerializeInterceptor(UserResponseDto)
  @Get('my-info')
  @UseGuards(JwtGuard)
  getMyInfo(@Request() req: { user: User }) {
    return req.user;
  }
}
