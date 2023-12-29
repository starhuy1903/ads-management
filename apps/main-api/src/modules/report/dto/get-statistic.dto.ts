import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class GetStatisticDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    value
      .trim()
      .split(',')
      .map((id: any) => Number(id)),
  )
  districtIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    value
      .trim()
      .split(',')
      .map((id: any) => Number(id)),
  )
  wardIds?: number[];

  @IsNotEmpty()
  dateValue: Date;

  @IsNotEmpty()
  dateType: EDateType;
}

export enum EDateType {
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}
