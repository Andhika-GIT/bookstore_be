import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from './order.service';
import { sendResponse } from '@/common/utils/response.util';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { User } from '@/user/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':orderId')
  async findOrderByOrderId(
    @Param('orderId') orderId: string,
    @Res() res: Response,
  ) {
    const order = await this.orderService.findOrderByOrderId(orderId);

    const formattedOrder = this.orderService.formatOrder(order);

    sendResponse(res, 200, 'Successfully get order', formattedOrder);
  }

  @Get('history/user')
  async getAllOrderByUserId(
    @Res() res: Response,
    @Request() req: { user: User },
  ) {
    console.log(req.user);
    const order = await this.orderService.getAllOrderByUserId(req.user);

    sendResponse(res, 200, 'Successfully get user order history', order);
  }
}
