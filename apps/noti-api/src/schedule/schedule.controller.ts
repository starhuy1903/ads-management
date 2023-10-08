import { Controller } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { MailScheduleDto, SchedulePriority as SP } from './schedule.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import {
  ScheduleMailReq,
  ScheduleMailRes,
  SchedulePriority,
} from '../proto/mail-schedule.pb';
import Validator from 'ajv';
import { validate } from 'class-validator';
import { TEMPLATES } from '../constants/templates';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @GrpcMethod('MailService', 'ScheduleMail')
  async setSendMailSchedule(
    data: ScheduleMailReq,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<ScheduleMailRes> {
    const scheduleData = new MailScheduleDto();
    scheduleData.name = data.name;
    scheduleData.priority = getPriority(data.priority);
    scheduleData.time = data.time;
    scheduleData.maxRetry = data.maxRetry;
    scheduleData.mailInfo = data.mailInfo;

    const errors = await validate(scheduleData);
    if (errors.length > 0) {
      return {
        jobId: null,
        msg: errors[0].constraints.isString,
      };
    }
    const validator = new Validator();
    const template = TEMPLATES.find(
      ({ name }) => name === scheduleData.mailInfo.template,
    );
    const avjValidate = validator.compile(template.validation);
    const isValid = avjValidate(JSON.parse(scheduleData.mailInfo.templateData));

    if (isValid) {
      return await this.scheduleService.createScheduleSendEmail(
        scheduleData.name,
        scheduleData.priority,
        scheduleData.time ?? new Date().getTime().toString(),
        scheduleData.mailInfo,
        scheduleData.maxRetry,
      );
    }
    return {
      jobId: '',
      msg:
        avjValidate.errors[0].instancePath +
        ' ' +
        avjValidate.errors[0].message,
    };
  }
}

const getPriority = (priority: SchedulePriority): SP => {
  switch (priority) {
    case SchedulePriority.lowest:
      return SP.lowest;
    case SchedulePriority.low:
      return SP.low;
    case SchedulePriority.normal:
      return SP.normal;
    case SchedulePriority.high:
      return SP.high;
    case SchedulePriority.highest:
      return SP.highest;
    default:
      return SP.normal;
  }
};
