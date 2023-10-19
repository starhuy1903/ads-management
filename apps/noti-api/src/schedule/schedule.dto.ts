import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SendMailTemplateDto } from '../mail/mail.dto';

export enum SchedulePriority {
  lowest,
  low,
  normal,
  high,
  highest,
}

export class MailScheduleDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  time: string;

  @IsNumber()
  @IsOptional()
  maxRetry: number;

  @IsEnum(SchedulePriority)
  @IsOptional()
  priority: SchedulePriority;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => SendMailTemplateDto)
  mailInfo: SendMailTemplateDto;
}
