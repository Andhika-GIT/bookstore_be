import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { sendResponse } from '../utils/response.util';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;

    // Check if the exception response contains validation errors
    if (typeof exceptionResponse === 'object' && exceptionResponse['message']) {
      message = exceptionResponse['message'];
    }

    sendResponse(response, status, message);
  }
}
