import {
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Response } from 'express';
import { User } from '@/user/entities/user.entity';
import { CreateUserDto } from './dto/create-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  @UseGuards(LocalGuard)
  signIn(@Request() req: { user: User }, @Res() res: Response) {
    return this.authService.signIn(req.user, res);
  }

  @Post('signUp')
  signUp(@Body() body: CreateUserDto, @Res() res: Response) {
    return this.authService.signUp(body, res);
  }
}
