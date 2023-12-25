import { IsDate, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  dob?: Date;
}
