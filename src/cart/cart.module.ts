import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Cart } from './entities/cart.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Cart])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
