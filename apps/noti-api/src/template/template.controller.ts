import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Query
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateResponse, TemplateDto } from './template.dto';
import { ListTemplateReq, ListTemplateRes } from '../proto/mail-schedule.pb';
import { GrpcMethod } from '@nestjs/microservices';
import { TEMPLATES } from '../constants/templates';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  async createTemplates(): Promise<CreateTemplateResponse> {
    const res = await this.templateService.create();
    return res ? { message: 'ok' } : { message: 'error' };
  }

  @Delete()
  async deleteTemplate(
    @Query('name') name: string,
  ): Promise<CreateTemplateResponse> {
    const res = await this.templateService.delete(name);
    return res
      ? { message: `Deleted template ${name}` }
      : { message: `Can not delete any template named ${name}` };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('all')
  async deleteAllTemplate(): Promise<void> {
    await this.templateService.deleteAll();
    return;
  }

  @GrpcMethod('MailService', 'GetTemplates')
  getListTemplates(): ListTemplateRes {
    const templates = TEMPLATES.map((template) => ({
      ...template,
      validation: JSON.stringify(template.validation),
    }));
    return { templates };
  }
}
