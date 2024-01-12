import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';

interface SuccessResponse {
  statusCode?: number;
  data?: unknown;
  message?: string;
}

interface ErrorResponse {
  statusCode?: number;
  message?: string;
}

export interface CustomResponse extends Response {
  success: (obj?: SuccessResponse) => void;
  error: (obj?: ErrorResponse) => void;
}

@Injectable()
export class CustomResponseMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: CustomResponse, next: () => void) {
    const reqLog = {
      body: req.body,
      headers: req.headers,
      query: req.query,
      originalUrl: req.originalUrl,
    };

    const logMessage = `${req.headers['user-agent']} ${req.ip} ${req.method} ${req.originalUrl} `;
    res.success = ({
      statusCode = 200,
      data = null,
      message = 'Success',
    } = {}) => {
      this.logger.log({
        req: reqLog,
        message: logMessage + `${res.statusCode}`,
        res: {
          success: true,
          data,
          message,
        },
      });
      return res.status(statusCode).json({
        success: true,
        data,
        message,
      });
    };

    res.error = ({ statusCode = 500, message } = {}) => {
      this.logger.error({
        req: reqLog,
        res: {
          success: false,
          message: message ?? 'Internal Server Error',
        },
        message: logMessage + `${statusCode}`,
      });
      return res.status(statusCode).json({
        success: false,
        message: message ?? 'Internal Server Error',
      });
    };

    next();
  }
}
