import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReportStatus } from '../../../constants/report';

export class UpdateReportDto {
  @IsEnum(ReportStatus)
  @IsOptional()
  readonly status?: ReportStatus;

  @IsNotEmpty()
  @IsString()
  readonly resolvedContent?: string;
}
