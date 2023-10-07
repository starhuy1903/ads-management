import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from './schedule/schedule.module';
import { DatabaseModule } from './database/database.module';
import { ScheduleController } from './schedule/schedule.controller';
import { ConfigModule } from '@nestjs/config';
import { AwsSesModule } from './aws-ses/aws-ses.module';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateModule } from './template/template.module';
import { TemplateController } from './template/template.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.TEMPLATE_DB),
    AwsSesModule,
    MailModule,
    ScheduleModule,
    DatabaseModule,
    TemplateModule,
  ],
  controllers: [ScheduleController, TemplateController],
  providers: [],
})
export class AppModule {}
