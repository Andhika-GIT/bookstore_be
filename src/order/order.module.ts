import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order } from './entities/order';
import { OrderItem } from './entities/order_item';

@Module({
  imports: [MikroOrmModule.forFeature([Order, OrderItem])],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService, MikroOrmModule],
})
export class OrderModule {}
