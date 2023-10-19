/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'mail';

export enum SchedulePriority {
  lowest = 0,
  low = 1,
  normal = 2,
  high = 3,
  highest = 4,
  UNRECOGNIZED = -1,
}

export interface MailInfo {
  toAddresses: string[];
  ccAddresses: string[];
  bccAddresses: string[];
  template: string;
  templateData: string;
}

export interface ScheduleMailReq {
  name: string;
  priority: SchedulePriority;
  time: string;
  maxRetry: number;
  mailInfo: MailInfo | undefined;
}

export interface ScheduleMailRes {
  jobId: string;
  msg: string;
}

export interface ListTemplateReq {}

export interface ListTemplateRes {
  templates: Template[];
}

export interface Template {
  name: string;
  subject: string;
  validation: string;
}

export const MAIL_PACKAGE_NAME = 'mail';

export interface MailServiceClient {
  scheduleMail(request: ScheduleMailReq): Observable<ScheduleMailRes>;

  getTemplates(request: ListTemplateReq): Observable<ListTemplateRes>;
}

export interface MailServiceController {
  scheduleMail(
    request: ScheduleMailReq,
  ): Promise<ScheduleMailRes> | Observable<ScheduleMailRes> | ScheduleMailRes;

  getTemplates(
    request: ListTemplateReq,
  ): Promise<ListTemplateRes> | Observable<ListTemplateRes> | ListTemplateRes;
}

export function MailServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['scheduleMail', 'getTemplates'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('MailService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('MailService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const MAIL_SERVICE_NAME = 'MailService';
