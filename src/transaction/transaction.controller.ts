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
import { MidtransCallbackDto } from './dto/midtrans_callback';

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
  async handlePaymentCallback(
    @Body() callbackData: MidtransCallbackDto,
    @Res() res: Response,
  ) {
    const transactionResponse =
      await this.transactionService.updateTransactionStatus(callbackData);

    sendResponse(
      res,
      200,
      'sucessfully create transaction',
      transactionResponse,
    );
  }
}
