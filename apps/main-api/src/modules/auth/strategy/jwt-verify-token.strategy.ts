import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ITokenPayload } from '../interfaces/ITokenPayload';

@Injectable()
export class JwtVerifyStrategy extends PassportStrategy(
  Strategy,
  'jwt-verify',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('verifyToken'),
      secretOrKey: process.env.JWT_VT_SECRET,
    });
  }

  async validate(payload: ITokenPayload) {
    return {
      payload,
    };
  }
}
