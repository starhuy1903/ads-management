import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

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
  use(req: unknown, res: CustomResponse, next: () => void) {
    
    res.success = ({
      statusCode = 200,
      data = null,
      message = 'Success',
    } = {}) => {
      return res.status(statusCode).json({
        success: true,
        data,
        message,
      });
    };

    res.error = ({ statusCode = 500, message = 'Error' } = {}) => {
      return res.status(statusCode).json({
        success: false,
        message,
      });
    };

    next();
  }
}
