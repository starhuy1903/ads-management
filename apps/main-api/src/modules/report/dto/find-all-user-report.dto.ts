import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Order } from '../../../constants/order';
import { ReportStatus } from '../../../constants/report';
import { TargetType } from '../../../constants/ads_request';

export class PageOptionsUserReportDto {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.DESC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly typeId?: number;

  @IsEnum(ReportStatus)
  @IsOptional()
  readonly status?: ReportStatus;

  @IsEnum(TargetType)
  @IsOptional()
  readonly targetType?: TargetType;

  @IsString()
  @IsNotEmpty()
  readonly userUuid: string;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
