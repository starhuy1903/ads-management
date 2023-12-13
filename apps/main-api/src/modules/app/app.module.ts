import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from '../../services/mail/mail.module';
import { CustomResponseMiddleware } from '../../middlewares';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PanelModule } from '../panel/panel.module';
import { LocationModule } from '../location/location.module';
import { ReportModule } from '../report/report.module';
import { AdsRequestModule } from '../ads-request/ads-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    MailModule,
    PrismaModule,
    PanelModule,
    LocationModule,
    ReportModule,
    AdsRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomResponseMiddleware).forRoutes('*');
  }
}
