import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsSesService } from '../aws-ses/aws-ses.service';
import {
  SendTemplatedEmailCommand,
  SendTemplatedEmailCommandInput,
} from '@aws-sdk/client-ses';
import { SendMailTemplateDto } from './mail.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AwsSesService)
    private readonly awsSesService: AwsSesService,
  ) {}

  async sendEmailTemplate(payload: SendMailTemplateDto) {
    const input: SendTemplatedEmailCommandInput = {
      // SendTemplatedEmailRequest
      Source: this.configService.get("sourceEmail"), // email sending template
      Destination: {
        // Destination
        ToAddresses: payload.toAddresses,
        CcAddresses: payload.ccAddresses ?? [],
        BccAddresses: payload.bccAddresses ?? [],
      },
      ReplyToAddresses: [],
      SourceArn: null,
      ReturnPathArn: null,

      ConfigurationSetName: null,
      Template: payload.template, // required
      TemplateArn: null,
      TemplateData: payload.templateData, // required
    };
    const command = new SendTemplatedEmailCommand(input);
    await this.awsSesService.getSesClient().send(command);
  }
}
