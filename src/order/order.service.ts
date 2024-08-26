import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Order } from './entities/order';
import { OrderItem } from './entities/order_item';
import { CreateOrderDto } from './dto/create-order';
import { handleFindOrFail } from '@/common/utils/handleFindOrFail';
import { GetOrderResponseDto } from './dto/get-order-response';
import { User } from '@/user/entities/user.entity';
import { UserOrderHistoryResponseDto } from './dto/user-order-history-response';

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
        book_name: item.book.title,
        img_url: item.book.img_url,
        order_quantity: item.quantity,
      };
    });

    return {
      order_id: order.order_id,
      total_price: order.total_price,
      status: order.status,
      payment_type: order?.payment_type,
      va_number: order?.va_number,
      bank: order?.bank,
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
      payment_type: data.payment_type,
      va_number: data?.va_number,
      bank: data?.bank,
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
      ['items.book', 'user'] as never[],
    );

    return order;
  }

  async getAllOrderByUserId(
    user: User,
    page: number,
  ): Promise<UserOrderHistoryResponseDto> {
    const pageSize = 3; // Fixed page size
    const offset = (page - 1) * pageSize;

    // Find orders with pagination
    const orders = await this.orderRepository.find(
      {
        user: user.id,
      },
      {
        limit: pageSize,
        offset: offset,
        orderBy: { order_id: 'ASC' },
        populate: ['items', 'items.book'],
      },
    );

    // Find the total number of orders for pagination
    const totalOrders = await this.orderRepository.count({
      user: user.id,
    });

    // Determine if there is a next page
    const totalPage = Math.ceil(totalOrders / pageSize);
    const nextPage = page < totalPage ? page + 1 : null;

    // Map orders to UserOrderHistoryResponseDto
    const orderResponses = orders.map((order) => {
      const items = order.items.getItems();
      const firstItem = items.length > 0 ? items[0].book : null;

      return {
        order_id: order.order_id,
        order_status: order.status,
        total_items: items.length,
        first_item: firstItem,
      };
    });

    return {
      total_page: totalPage,
      next_page: nextPage,
      items: orderResponses,
    };
  }
}
