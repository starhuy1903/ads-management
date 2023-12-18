import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
