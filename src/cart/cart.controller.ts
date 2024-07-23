import {
  Controller,
  Param,
  ParseIntPipe,
  Get,
  Res,
  HttpStatus,
  Body,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { BookService } from '@/book/book.service';
import { sendResponse } from '@/common/utils/response.util';
import { Response } from 'express';
import { CreateCartReqDto } from './dto/create-cart-req';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { User } from '@/user/entities/user.entity';

@Controller('cart')
@UseGuards(JwtGuard)
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly bookService: BookService,
  ) {}

  @Get()
  async findAllCart(@Res() res: Response, @Request() req: { user: User }) {
    const cart = await this.cartService.findAllCart(req?.user?.id);

    sendResponse(res, HttpStatus.OK, 'Cart items retreived successfully', cart);
  }

  @Get('user/items')
  async findAllCartItemsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
    @Request() req: { user: User },
  ) {
    const cartItems = this.cartService.findAllCartItemsByUserId(req?.user?.id);

    sendResponse(
      res,
      HttpStatus.OK,
      'Cart Items Retreived successfully',
      cartItems,
    );
  }

  @Get(':cartId/items')
  async findAllCartItemsByCartId(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Res() res: Response,
  ) {
    const cartItems = this.cartService.findAllCartItemsByCartId(cartId);

    sendResponse(
      res,
      HttpStatus.OK,
      'Cart items retreived successfully',
      cartItems,
    );
  }

  @Post()
  async createCart(
    @Body() newCartItems: CreateCartReqDto,
    @Res() res: Response,
    @Request() req: { user: User },
  ) {
    await this.bookService.findOne(newCartItems?.book_id);

    try {
      await this.cartService.createCart({
        ...newCartItems,
        user_id: req?.user?.id,
      });

      sendResponse(res, HttpStatus.OK, 'Successfully create cart');
    } catch (error) {
      return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}
