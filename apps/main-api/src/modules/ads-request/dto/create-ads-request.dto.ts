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

export class CreateAdsRequestDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly userId?: number;

  @IsNotEmpty()
  @IsString()
  readonly reason?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly panelId?: number;
}

export class CreateAdsRequestPanelDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly userId?: number;

  @IsNotEmpty()
  @IsString()
  readonly reason?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly panelId?: number;
}

export class CreateAdsRequestUpdateLocationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly userId?: number;

  @IsNotEmpty()
  @IsString()
  readonly reason?: string;

  //location
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
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly belongLocationId?: number;

  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  imgUrls: string[];
}

export class CreateAdsRequestUpdatePanelDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly typeId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly locationId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly userId?: number;

  @IsNotEmpty()
  @IsString()
  readonly reason?: string;

  //panel

  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  readonly width?: number;

  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  readonly height?: number;

  @IsNotEmpty()
  readonly createContractDate?: Date;

  @IsNotEmpty()
  readonly expiredContractDate?: Date;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly companyEmail?: string;

  @IsNotEmpty()
  @IsString()
  readonly companyNumber?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly belongPanelId?: number;

  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  imgUrls: string[];
}
