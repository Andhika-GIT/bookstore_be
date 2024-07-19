import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  HttpExceptionFilter,
  NotFoundExceptionFilter,
} from './common/exceptions';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new NotFoundExceptionFilter(),
    new HttpExceptionFilter(),
  );
  app.use(cookieParser());
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Apply the global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 422, // Use 422 Unprocessable Entity for validation errors
    }),
  );
  await app.listen(3000);
}
bootstrap();
