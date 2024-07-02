import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(config), BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
