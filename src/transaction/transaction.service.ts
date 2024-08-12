import { MidtransService } from '@/midtrans/midtrans.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientTransactionRequestDto } from './dto/client_transaction_request';
import { User } from '@/user/entities/user.entity';
import * as crypto from 'crypto';
import { MidtransCallbackDto } from './dto/midtrans_callback';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { OrderItem } from './entities/order_item';
import { Order } from './entities/order';
import { handleFindOrFail } from '@/common/utils/handleFindOrFail';
import { ClientTransactionResponseDto } from './dto/client_transaction_response';

@Injectable()
export class TransactionService {
  constructor(
    private readonly midtransService: MidtransService,
    private readonly em: EntityManager,
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: EntityRepository<OrderItem>,
  ) {}

  private verifySignatureKey(
    signatureKey: string,
    orderId: string,
    statusCode: string,
    grossAmount: string,
  ): boolean {
    const serverKey = process.env.MIDTRANS_SANDBOX_SERVER_KEY;
    const payload = orderId + statusCode + grossAmount + serverKey;

    // Hash the payload using SHA512
    const calculatedSignatureKey = crypto
      .createHash('sha512')
      .update(payload)
      .digest('hex');

    // Compare the calculated signature key with the received one
    return calculatedSignatureKey === signatureKey;
  }

  async getTransactionToken(
    clientTransactionRequest: ClientTransactionRequestDto,
    userData: User,
  ) {
    const items = clientTransactionRequest?.items?.map((item) => ({
      id: item?.book_id,
      price: Math.round(item?.price),
      quantity: item?.quantity,
      name: item?.title,
    }));

    const user = {
      first_name: userData?.username,
      last_name: userData?.username,
      email: userData?.email,
    };

    const recalculatedTotalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const createTransactionTokenpayload = {
      total_price: recalculatedTotalPrice,
      items,
      user,
    };

    const transactionResponse =
      await this.midtransService.createTransactionToken(
        createTransactionTokenpayload,
      );

    // create order
    const order = this.orderRepository.create({
      order_id: transactionResponse?.orderId,
      total_price: recalculatedTotalPrice,
      status: 'PENDING',
      user: userData,
    });

    // create order items
    const orderItems: OrderItem[] = clientTransactionRequest?.items?.map(
      (item) => {
        return this.orderItemRepository.create({
          order: order,
          book: item?.book_id,
          quantity: item?.quantity,
          price: item?.price,
        });
      },
    );

    // insert order items into order
    order.items.add([...orderItems]);

    await this.em.persistAndFlush(order);

    return transactionResponse;
  }

  async updateTransactionStatus(
    callbackData: MidtransCallbackDto,
  ): Promise<ClientTransactionResponseDto> {
    const isValidSignatureKey = this.verifySignatureKey(
      callbackData.signature_key,
      callbackData.order_id,
      callbackData.status_code,
      callbackData.gross_amount,
    );

    if (!isValidSignatureKey) {
      throw new BadRequestException('invalid signature key');
    }

    const order = await handleFindOrFail(this.orderRepository, {
      order_id: callbackData.order_id,
    });

    switch (callbackData.transaction_status) {
      case 'capture':
        if (callbackData.fraud_status === 'accept') {
          order.status = 'COMPLETED'; // Atau status lain yang sesuai
        } else {
          order.status = 'FAILED'; // Atau status lain yang sesuai
        }
        break;

      case 'settlement':
        order.status = 'SETTLED'; // Atau status lain yang sesuai
        break;

      case 'cancel':
      case 'deny':
      case 'expire':
        order.status = 'CANCELLED'; // Atau status lain yang sesuai
        break;

      case 'pending':
        order.status = 'PENDING'; // Status tetap PENDING
        break;

      default:
        throw new BadRequestException('Unknown transaction status');
    }

    // Simpan perubahan ke database
    await this.em.persistAndFlush(order);

    return {
      order_id: callbackData.order_id,
      status: callbackData.transaction_status,
    };
  }
}
