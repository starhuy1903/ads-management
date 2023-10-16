import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtVerifyStrategy, JwtRefreshStrategy, JwtStrategy } from './strategy';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, JwtVerifyStrategy, MailService],
})
export class AuthModule {}
