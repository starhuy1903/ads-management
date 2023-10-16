import { Injectable} from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MailServiceClient, ScheduleMailReq, ListTemplateReq,ScheduleMailRes,ListTemplateRes, MAIL_PACKAGE_NAME, MAIL_SERVICE_NAME} from '../proto/mail-schedule.pb';

@Injectable()
export class MailService {
  private readonly grpcClient: ClientGrpc;
  private readonly mailServiceClient: MailServiceClient;
  constructor() {
    this.grpcClient = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: MAIL_PACKAGE_NAME,
        protoPath: 'apps/auth-api/src/proto/mail-schedule.proto', 
        url: process.env.GRPC_URL,
      },
    });
    this.mailServiceClient = this.grpcClient.getService<MailServiceClient>(MAIL_SERVICE_NAME);
  }

  scheduleMail(data: ScheduleMailReq): Observable<ScheduleMailRes> {
    return this.mailServiceClient.scheduleMail(data);
  }

  getTemplates(data: ListTemplateReq): Observable<ListTemplateRes> {
    return this.mailServiceClient.getTemplates(data);
  }
}
