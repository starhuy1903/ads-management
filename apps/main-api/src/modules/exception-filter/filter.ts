import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

//Catch and log error by guard, validation,...
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('HTTP');
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const reqLog = {
      body: request.body,
      headers: request.headers,
      query: request.query,
      originalUrl: request.originalUrl,
    };

    const message = `${request.headers['user-agent']} ${request.ip} ${request.method} ${request.originalUrl} `;

    let status: HttpStatus;
    let errorMessage: string | object;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorMessage = exception.getResponse();
    } else if (exception instanceof Error) {
      (status = HttpStatus.INTERNAL_SERVER_ERROR),
        (errorMessage = { success: false, message: exception.message });
    }

    this.logger.error({
      req: reqLog,
      res: errorMessage,
      message: message + `${status}`,
    });

    response.status(status).json(errorMessage);
  }
}
