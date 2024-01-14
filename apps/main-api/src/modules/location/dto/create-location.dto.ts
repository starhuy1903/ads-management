import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

const optionalBooleanMapper = new Map([
  ['undefined', undefined],
  ['true', true],
  ['false', false],
]);

export const ParseOptionalBoolean = () =>
  Transform(({ value }) => optionalBooleanMapper.get(value));

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

  @Transform(({ value }) => optionalBooleanMapper.get(value))
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
