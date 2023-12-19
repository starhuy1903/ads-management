import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TargetType } from '../../../constants/ads_request';
import { AdsRequestType } from '@prisma/client';
export class CreateAdsRequestDto {
  @IsEnum(AdsRequestType)
  @IsNotEmpty()
  readonly type?: AdsRequestType;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly userId?: number;

  @IsNotEmpty()
  @IsString()
  readonly reason?: string;

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
}
