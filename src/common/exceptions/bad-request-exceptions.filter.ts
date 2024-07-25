import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { sendResponse } from '../utils/response.util';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    const errorResponse = exception.getResponse() as {
      message: string | string[];
    };
    const message =
      typeof errorResponse.message === 'string'
        ? errorResponse.message
        : 'Bad Request';

    sendResponse(response, 400, message);
  }
}
