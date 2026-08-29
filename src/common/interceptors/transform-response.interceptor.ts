import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface ResponseFormat<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode || 200;

    return next.handle().pipe(
      map((result) => {
        // If result already has custom structure
        if (result && typeof result === "object" && "data" in result && "statusCode" in result) {
          return result;
        }

        return {
          statusCode,
          message: "Success",
          data: result,
        };
      })
    );
  }
}