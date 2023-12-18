import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from '../../../constants/order';
import { AdsRequestStatus, TargetType } from '../../../constants/ads_request';

export class PageOptionsAdsRequestDto {
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

  @IsEnum(AdsRequestStatus)
  @IsOptional()
  readonly status?: AdsRequestStatus;

  @IsEnum(TargetType)
  @IsOptional()
  readonly targetType?: TargetType;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
