import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from '../../../constants/order';
import { ReportStatus } from '../../../constants/report';
import { TargetType } from '../../../constants/ads_request';

export class PageOptionsReportDto {
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

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    value
      .trim()
      .split(',')
      .map((id: any) => Number(id)),
  )
  districts?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    value
      .trim()
      .split(',')
      .map((id: any) => Number(id)),
  )
  wards?: number[];

  @IsEnum(ReportStatus)
  @IsOptional()
  readonly status?: ReportStatus;

  @IsEnum(TargetType)
  @IsOptional()
  readonly targetType?: TargetType;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
