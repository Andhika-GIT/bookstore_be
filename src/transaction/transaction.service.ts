import { MidtransService } from '@/midtrans/midtrans.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientTransactionRequestDto } from './dto/client_transaction_request';
import { User } from '@/user/entities/user.entity';
import * as crypto from 'crypto';
import { MidtransCallbackDto } from './dto/midtrans_callback';

@Injectable()
export class TransactionService {
  constructor(private readonly midtransService: MidtransService) {}

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
    const total_price = Math.round(clientTransactionRequest?.total_price);
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

    return transactionResponse;
  }

  async updateTransactionStatus(callbackData: MidtransCallbackDto) {
    const isValidSignatureKey = this.verifySignatureKey(
      callbackData.signature_key,
      callbackData.order_id,
      callbackData.status_code,
      callbackData.gross_amount,
    );

    if (!isValidSignatureKey) {
      throw new BadRequestException('invalid signature key');
    }
  }

  async createOrder() {}
}
