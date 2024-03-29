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
import { DistrictModule } from '../district/district.module';
import { WardModule } from '../ward/ward.module';
import { UserModule } from '../user/user.module';
import { AdvertisementTypeModule } from '../advertisement-type/advertisement-type.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../exception-filter/filter';

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
    DistrictModule,
    WardModule,
    UserModule,
    AdvertisementTypeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomResponseMiddleware).forRoutes('*');
  }
}
