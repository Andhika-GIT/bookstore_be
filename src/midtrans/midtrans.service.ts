import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

import * as Midtrans from 'midtrans-client';
import { CreateTransactionRequestDto } from './dto/create-transaction-request';

@Injectable()
export class MidtransService {
  private snap: Midtrans.Snap;

  constructor() {
    this.snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SANDBOX_SERVER_KEY,
    });
  }

  private generateOrderId = (): string => {
    const uuid = uuidv4().split('-')[0];
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds();

    return `ORDER-${uuid}-${day}-${month}-${year}-${hours}${minutes}${seconds}-${milliseconds}`;
  };

  async createTransactionToken(
    transactionData: CreateTransactionRequestDto,
  ): Promise<{
    transactionToken: string;
    orderId: string;
  }> {
    const { total_price, user, items } = transactionData;

    const orderId = this.generateOrderId();

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total_price,
      },
      item_details: items.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })),
      customer_details: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      enabled_payments: ['bca_va', 'bni_va', 'credit_card'],
      callbacks: {
        finish: `${process.env.PUBLIC_FRONTEND_URL}/orders/${orderId}`,
        unfinish: `${process.env.PUBLIC_FRONTEND_URL}/orders/${orderId}`,
        error: `${process.env.PUBLIC_FRONTEND_URL}/orders`,
      },
    };

    try {
      const transaction = await this.snap.createTransaction(parameter);
      return {
        transactionToken: transaction.token,
        orderId: orderId,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to create transaction: ' + error.message,
      );
    }
  }
}
