import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

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

  async createTransactionToken(transactionData: CreateTransactionRequestDto) {
    const { total_price, user, items } = transactionData;

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${uuidv4()}`,
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
      enabled_payments: ['bca_va', 'bni_va'], // Hanya BCA VA dan BNI VA,
      callbacks: {
        finish: `${process.env.PUBLIC_FRONTEND_URL}`,
        unfinish: `${process.env.PUBLIC_FRONTEND_URL}`,
        error: `${process.env.PUBLIC_FRONTEND_URL}`,
        cancel: `${process.env.PUBLIC_FRONTEND_URL}`,
        // Anda bisa menambahkan URL callback lain sesuai kebutuhan
      },
    };

    try {
      const transaction = await this.snap.createTransaction(parameter);
      return {
        transactionToken: transaction.token,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to create transaction: ' + error.message,
      );
    }
  }
}
