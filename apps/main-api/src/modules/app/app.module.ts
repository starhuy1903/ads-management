import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from '../../services/mail/mail.module';
import { CustomResponseMiddleware } from '../../middlewares';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PanelModule } from '../panel/panel.module';
import { LocationModule } from '../location/location.module';
import { ReportModule } from '../report/report.module';
import { AdsRequestModule } from '../ads-request/ads-request.module';
import { AuthModule } from '../auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ReportTypeModule } from '../report-type/report-type.module';
import { LocationTypeModule } from '../location-type/location-type.module';
import { PanelTypeModule } from '../panel-type/panel-type.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    MailModule,
    PrismaModule,
    PanelModule,
    LocationModule,
    ReportModule,
    AdsRequestModule,
    AuthModule,
    ReportTypeModule,
    LocationTypeModule,
    PanelTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomResponseMiddleware).forRoutes('*');
  }
}
