import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { sendResponse } from '../utils/response.util';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    const errorResponse = exception.getResponse() as {
      message: string | string[];
    };
    const message =
      typeof errorResponse.message === 'string'
        ? errorResponse.message
        : 'Unauthorized';
    sendResponse(response, 401, message);
  }
}
