import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ITokenPayload } from '../interfaces/ITokenPayload';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_RT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: ITokenPayload) {
    const refreshToken = request.header('authorization').split(' ')[1];
    const tokenId = request.header('token_id');

    return {
      refreshToken,
      tokenId,
      payload,
    };
  }
}
