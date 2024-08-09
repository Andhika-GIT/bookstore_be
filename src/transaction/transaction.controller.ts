import { JwtGuard } from '@/auth/guards/jwt.guard';
import { TransactionService } from './transaction.service';
import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientTransactionRequestDto } from './dto/client_transaction_request';
import { User } from '@/user/entities/user.entity';
import { Response } from 'express';
import { sendResponse } from '@/common/utils/response.util';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post('create')
  async createTransaction(
    @Body() clientTransactionBody: ClientTransactionRequestDto,
    @Request() req: { user: User },
    @Res() res: Response,
  ) {
    const transactionResponse =
      await this.transactionService.getTransactionToken(
        clientTransactionBody,
        req?.user,
      );

    sendResponse(
      res,
      200,
      'sucessfully catch up transaction',
      transactionResponse,
    );
  }

  @Post('callback')
  handlePaymentCallback(@Body() callbackData: any) {
    console.log('Received payment callback:', callbackData);

    // Lakukan logika untuk menangani data callback, seperti memperbarui status transaksi

    return { status: 'success' }; // Kirim respons yang sesuai
  }
}
