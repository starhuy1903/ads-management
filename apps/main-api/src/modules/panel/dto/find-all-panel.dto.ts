import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from '../../../constants/order';
import { PanelStatus } from '@prisma/client';

export class PageOptionsPanelDto {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.DESC;

  @IsOptional()
  @IsArray()
  @IsEnum(PanelStatus, { each: true })
  @Transform(({ value }) =>
    value
      .trim()
      .split(',')
      .map((status) => PanelStatus[status as keyof typeof PanelStatus]),
  )
  readonly status?: PanelStatus[];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number;

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
      .map((id) => Number(id)),
  )
  districts?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    value
      .trim()
      .split(',')
      .map((id) => Number(id)),
  )
  wards?: number[];

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
