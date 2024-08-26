import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestExceptionFilter,
  HttpExceptionFilter,
  NotFoundExceptionFilter,
  UnauthorizedExceptionFilter,
} from './common/exceptions';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new NotFoundExceptionFilter(),
    new HttpExceptionFilter(),
    new UnauthorizedExceptionFilter(),
    new BadRequestExceptionFilter(),
  );
  app.use(cookieParser());
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: [
      'http://localhost:4000',
      'http://localhost:5000',
      'http://example.com',
      'http://192.168.1.3',
    ],
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
