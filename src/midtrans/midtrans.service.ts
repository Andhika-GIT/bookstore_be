import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import Midtrans from 'midtrans-client';

@Injectable()
export class MidtransService {
  constructor() {
    this.snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SANDBOX_SERVER_KEY,
    });
  }

  async createTransaction(userData: any, items: any[]) {
    const grossAmount = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${uuidv4()}`,
        gross_amount: grossAmount,
      },
      item_details: items.map((item) => ({
        id: item.book_name, // Ganti dengan ID yang sesuai jika perlu
        price: item.price,
        quantity: item.quantity,
        name: item.book_name,
      })),
      customer_details: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        // Anda bisa menambahkan billing_address dan shipping_address jika perlu
      },
      enabled_payments: ['bca_va', 'bni_va'], // Hanya BCA VA dan BNI VA
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
