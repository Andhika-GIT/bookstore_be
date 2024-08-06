import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CartModule } from './cart/cart.module';
import { GenreService } from './genre/genre.service';
import { GenreModule } from './genre/genre.module';
import config from './mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    BookModule,
    UserModule,
    AuthModule,
    CloudinaryModule,
    CartModule,
    GenreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
