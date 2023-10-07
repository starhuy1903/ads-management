import { IsNotEmpty, IsObject } from 'class-validator';

export interface CreateTemplateDto {
  name: string;
  subject: string;
  source: string;
  textSource: string;
}

export interface CreateTemplateResponse {
  message: string;
}

export class TemplateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  source: string;

  // @IsNotEmpty()
  textSource: string;

  @IsNotEmpty()
  @IsObject()
  validation: object;
}
