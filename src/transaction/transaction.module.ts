import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MidtransModule } from '@/midtrans/midtrans.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order } from './entities/order';
import { OrderItem } from './entities/order_item';

@Module({
  imports: [MidtransModule, MikroOrmModule.forFeature([Order, OrderItem])],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
