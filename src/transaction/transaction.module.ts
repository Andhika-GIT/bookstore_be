import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MidtransModule } from '@/midtrans/midtrans.module';
import { BookModule } from '@/book/book.module';
import { OrderModule } from '@/order/order.module';

@Module({
  imports: [MidtransModule, OrderModule, BookModule],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
