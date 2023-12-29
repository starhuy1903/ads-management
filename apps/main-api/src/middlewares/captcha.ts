import { Injectable, NestMiddleware } from '@nestjs/common';
import axios from 'axios';
import { CustomResponse } from './response';
import { Request } from 'express';

@Injectable()
export class RecaptchaMiddleware implements NestMiddleware {
  async use(req: Request, res: CustomResponse, next: () => void) {
    const recaptchaToken = req.headers['recaptcha-token'];
    const remoteip = req.ip;

    if (!recaptchaToken) {
      return res.error({
        message: 'reCAPTCHA token is missing',
        statusCode: 400,
      });
    }

    if (recaptchaToken === process.env.RECAPTCHA_BYPASS) {
      return next();
    } // Bypass for development

    try {
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        {
          secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
          remoteip,
        },
      );

      if (!response.data.success) {
        return res.error({
          message: 'Validate Captcha failed!',
          statusCode: 403,
        });
      }

      return next();
    } catch (error) {
      return res.error();
    }
  }
}
