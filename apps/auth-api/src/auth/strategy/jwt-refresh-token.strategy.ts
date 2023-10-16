import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ITokenPayload } from '../interfaces/ITokenPayload';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get('JWT_RT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: ITokenPayload) {
    const refreshToken = request.body.refreshToken;
    const tokenId = request.body.tokenId;

    if (!refreshToken || !tokenId || !payload) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    return {
      refreshToken,
      tokenId,
      payload,
    };
  }
}
