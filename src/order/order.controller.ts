import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from './order.service';
import { sendResponse } from '@/common/utils/response.util';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { User } from '@/user/entities/user.entity';

@Controller('order')
@UseGuards(JwtGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('history/user')
  async getAllOrderByUserId(
    @Query('page') page: number,
    @Res() res: Response,
    @Request() req: { user: User },
  ) {
    const order = await this.orderService.getAllOrderByUserId(req.user, page);

    sendResponse(res, 200, 'Successfully get user order history', order);
  }

  @Get(':orderId')
  async findOrderByOrderId(
    @Param('orderId') orderId: string,
    @Res() res: Response,
  ) {
    const order = await this.orderService.findOrderByOrderId(orderId);

    const formattedOrder = this.orderService.formatOrder(order);

    sendResponse(res, 200, 'Successfully get order', formattedOrder);
  }
}
