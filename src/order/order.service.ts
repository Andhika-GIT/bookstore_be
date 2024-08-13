import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Order } from './entities/order';
import { OrderItem } from './entities/order_item';
import { CreateOrderDto } from './dto/create-order';
import { handleFindOrFail } from '@/common/utils/handleFindOrFail';
import { GetOrderResponseDto } from './dto/get-order-response';

@Injectable()
export class OrderService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: EntityRepository<OrderItem>,
  ) {}

  formatOrder(order: Order): GetOrderResponseDto {
    const items = order.items.getItems().map((item) => {
      return {
        book_id: item.book.id,
        book_price: item.book.price,
        img_url: item.book.img_url,
        order_quantity: item.quantity,
      };
    });

    return {
      order_id: order.order_id,
      total_price: order.total_price,
      status: order.status,
      items: items,
    };
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
    // create order
    const order = this.orderRepository.create({
      order_id: data.order_id,
      total_price: data.total_price,
      status: data.status,
      user: data.user,
    });

    // create order items
    const orderItems = data?.items?.map((item) => {
      return this.orderItemRepository.create({
        order: order,
        book: item?.book_id,
        quantity: item?.quantity,
        price: item?.price,
      });
    });

    // insert order items into order
    order.items.add([...orderItems]);

    return order;
  }

  async findOrderByOrderId(order_id: string): Promise<Order> {
    const order = await handleFindOrFail(
      this.orderRepository,
      {
        order_id: order_id,
      },
      ['items.book'] as never[],
    );

    return order;
  }
}
