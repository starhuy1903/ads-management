import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  exports: [ScheduleService],
  providers: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
