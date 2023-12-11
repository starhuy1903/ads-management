import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from '../../services/mail/mail.module';
import { CustomResponseMiddleware } from '../../middlewares';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../services/prisma/prisma.module';

@Module({
  imports: [MailModule, AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomResponseMiddleware).forRoutes('*');
  }
}
