import { MidtransService } from '@/midtrans/midtrans.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientTransactionRequestDto } from './dto/client_transaction_request';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(private readonly midtransService: MidtransService) {}

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

  async createOrder() {}
}
