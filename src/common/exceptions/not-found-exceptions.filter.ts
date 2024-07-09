// exceptions/not-found-exception.filter.ts

import { Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { NotFoundException } from '@nestjs/common';
import { sendResponse } from '../utils/response.util';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: any) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    sendResponse(response, 404, 'Not Found');
  }
}
