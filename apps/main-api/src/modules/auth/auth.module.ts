import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy, JwtStrategy, JwtVerifyStrategy } from './strategy';
import { MailModule } from '../../services/mail/mail.module';
import { RolesGuard } from './guards';

@Module({
  imports: [JwtModule.register({}), MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtVerifyStrategy,
    RolesGuard,
  ],
})
export class AuthModule {}
