import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePanelDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly typeId?: number;

  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  readonly width?: number;

  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  readonly height?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly locationId?: number;

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

  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  imgUrls: string[];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly belongPanelId?: number;
}
