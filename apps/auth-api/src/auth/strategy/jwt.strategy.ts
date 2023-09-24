import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt' // this name should match the string argument in UseGuards(AuthGuard('jwt'). If leave it blank, it defaults to be 'jwt'
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: config.get('JWT_AT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    return payload;
  }
}
