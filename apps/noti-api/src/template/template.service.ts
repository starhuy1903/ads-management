import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template } from '../schemas/template.schema';
import { AwsSesService } from '../aws-ses/aws-ses.service';
import {
  CreateTemplateCommand,
  DeleteTemplateCommand,
} from '@aws-sdk/client-ses';
import { readTemplateFile } from '../../utils';
import { TEMPLATES } from '../constants/templates';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name)
    private templateModel: Model<Template>,
    private readonly awsSesService: AwsSesService,
  ) {}

  async create(): Promise<Template | boolean> {
    const client = this.awsSesService.getSesClient();
    for (const item of TEMPLATES) {
      const html = await readTemplateFile(item.name + '.html');
      if (!html) return false;
      const input = {
        Template: {
          TemplateName: item.name,
          SubjectPart: item.subject,
          TextPart: '',
          HtmlPart: html,
        },
      };

      const command = new CreateTemplateCommand(input);
      try {
        const res = await client.send(command);
        console.log(item.name, 'success---->', res);
      } catch (error) {
        console.log(item.name, 'error--->', error);
      }
    }

    return true;
  }

  async delete(name: string): Promise<boolean> {
    const client = this.awsSesService.getSesClient();
    const input = {
      TemplateName: name, // required
    };
    const command = new DeleteTemplateCommand(input);
    try {
      await client.send(command);
      return true;
    } catch (error) {
      console.log('Delete template failed: ', error);
      return false;
    }
  }

  async deleteAll(): Promise<boolean> {
    const client = this.awsSesService.getSesClient();
    for (const item of TEMPLATES) {
      const input = {
        TemplateName: item.name, // required
      };
      const command = new DeleteTemplateCommand(input);
      try {
        await client.send(command);
      } catch (error) {
        console.log(`Delete template ${item.name} failed: `, error);
      }
    }
    return true;
  }
}
