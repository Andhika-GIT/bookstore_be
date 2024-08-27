import { MidtransService } from '@/midtrans/midtrans.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientTransactionRequestDto } from './dto/client_transaction_request';
import { User } from '@/user/entities/user.entity';
import * as crypto from 'crypto';
import { MidtransCallbackDto } from './dto/midtrans_callback';

import { EntityManager, EntityRepository } from '@mikro-orm/core';

import { ClientTransactionResponseDto } from './dto/client_transaction_response';
import { BookService } from '@/book/book.service';
import { OrderService } from '@/order/order.service';
import { CartService } from '@/cart/cart.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly midtransService: MidtransService,
    private readonly orderService: OrderService,
    private readonly bookService: BookService,
    private readonly cartService: CartService,
    private readonly em: EntityManager,
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
    const order = await this.orderService.createOrder({
      order_id: transactionResponse.orderId,
      total_price: recalculatedTotalPrice,
      status: 'PENDING',
      user: userData,
      items: clientTransactionRequest.items,
      payment_type: 'none',
      va_number: '',
      bank: '',
    });

    // reduce book quantity
    await this.bookService.reduceBookQuantity(order.items.getItems());

    // save to database
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

    const order = await this.orderService.findOrderByOrderId(
      callbackData.order_id,
    );

    order.payment_type = callbackData.payment_type;
    order.bank = callbackData?.va_numbers[0]?.bank;
    order.va_number = callbackData?.va_numbers[0]?.va_number;

    await this.cartService.clearCart(order.user);

    switch (callbackData.transaction_status) {
      case 'capture':
        if (callbackData.fraud_status === 'accept') {
          order.status = 'COMPLETED';
        } else {
          order.status = 'FAILED';
        }
        break;

      case 'settlement':
        order.status = 'SETTLED';
        break;

      case 'cancel':
      case 'deny':
      case 'expire':
        order.status = 'CANCELLED';
        // restore book quantity
        await this.bookService.restoreBookQuantity(order.items.getItems());

        break;

      case 'pending':
        order.status = 'PENDING';
        break;

      default:
        throw new BadRequestException('Unknown transaction status');
    }

    await this.em.persistAndFlush(order);

    return {
      order_id: callbackData.order_id,
      status: callbackData.transaction_status,
    };
  }
}
