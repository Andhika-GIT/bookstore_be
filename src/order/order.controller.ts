import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from './order.service';
import { sendResponse } from '@/common/utils/response.util';

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
}
