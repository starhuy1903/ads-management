import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CdoUpdateUserDto {
  @IsString()
  role: string;

  @IsNumber()
  @IsOptional()
  wardId?: number;

  @IsNumber()
  @IsOptional()
  districtId?: number;
}
