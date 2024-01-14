import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TargetType } from '../../../constants/ads_request';

export class CreateReportDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly typeId?: number;

  @IsNotEmpty()
  @IsString()
  readonly fullName?: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email?: string;

  @IsNotEmpty()
  @IsString()
  readonly content?: string;

  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  imgUrls: string[];

  @IsEnum(TargetType)
  @IsNotEmpty()
  readonly targetType?: TargetType;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly locationId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly panelId?: number;

  @IsNotEmpty()
  @IsString()
  readonly userUuid: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly lat?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly long?: number;
}
