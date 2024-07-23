import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart_item.entity';
import { BookModule } from '@/book/book.module';

@Module({
  imports: [MikroOrmModule.forFeature([Cart, CartItem]), BookModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService, MikroOrmModule],
})
export class CartModule {}
