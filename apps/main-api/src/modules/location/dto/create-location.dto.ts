import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateLocationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly typeId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly adsTypeId?: number;

  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  readonly long?: number;

  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  readonly lat?: number;

  @Type(() => Boolean)
  @IsNotEmpty()
  readonly isPlanning?: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly districtId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly wardId?: number;

  @IsNotEmpty()
  readonly fullAddress?: string;

  @IsNotEmpty()
  readonly name?: string;

  @Type(() => Number)
  @IsOptional()
  readonly belongLocationId?: number;
}
