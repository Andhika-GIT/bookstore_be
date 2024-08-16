import {
  Controller,
  Param,
  ParseIntPipe,
  Get,
  Res,
  HttpStatus,
  Body,
  Post,
  Patch,
  Delete,
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
    @Res() res: Response,
    @Request() req: { user: User },
  ) {
    const cartItems = await this.cartService.findAllCartItemsByUserId(
      req?.user?.id,
    );

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
    const cartItems = await this.cartService.findAllCartItemsByCartId(cartId);

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
      return sendResponse(res, error?.status, error.message);
    }
  }

  @Patch(':cartItemId/increase')
  async increaseCartItemQuantity(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
    @Res() res: Response,
  ) {
    const cartItem = await this.cartService.findCartItemsById(cartItemId);

    try {
      await this.cartService.increaseCartItemQuantity(cartItem, quantity);
      sendResponse(
        res,
        HttpStatus.OK,
        'Cart item quantity increased successfully',
      );
    } catch (error) {
      return sendResponse(
        res,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Patch(':cartItemId/decrease')
  async decreaseCartItemQuantity(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @Res() res: Response,
  ) {
    const cartItem = await this.cartService.findCartItemsById(cartItemId);

    try {
      await this.cartService.decreaseCartItemQuantity(cartItem);
      sendResponse(
        res,
        HttpStatus.OK,
        'Cart item quantity decreased successfully',
      );
    } catch (error) {
      return sendResponse(
        res,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Delete(':cartItemId')
  async deleteCartItem(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @Res() res: Response,
  ) {
    const cartItem = await this.cartService.findCartItemsById(cartItemId);

    try {
      await this.cartService.deleteCartItem(cartItem);
      sendResponse(res, HttpStatus.OK, 'Cart item deleted successfully');
    } catch (error) {
      return sendResponse(
        res,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }
}
