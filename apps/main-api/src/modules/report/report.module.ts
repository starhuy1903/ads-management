import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { RecaptchaMiddleware } from '../../middlewares/captcha';
import { JwtStrategy } from '../auth/strategy';
import { RolesGuard } from '../auth/guards';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, JwtStrategy, RolesGuard, UserService],
})
export class ReportModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RecaptchaMiddleware)
      .forRoutes({ path: '/reports', method: RequestMethod.POST });
  }
}
