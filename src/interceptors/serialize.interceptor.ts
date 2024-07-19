import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): any;
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        // send response based on user dto structure
        return plainToClass(this.dto, data, {
          // set this to true, so we only send property that is @Expose() in user dto
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

// create custom decorator to simplify useInterceptors decorator in the controller
export const UseSerializeInterceptor = (dto: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};
