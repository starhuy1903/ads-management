import { Response } from 'express';

export const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  data: unknown,
  message = 'Success',
) => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message = 'Unknown error',
) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
