import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './create-location.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { LocationStatus } from '@prisma/client';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @IsEnum(LocationStatus)
  @IsOptional()
  readonly status?: LocationStatus;
}
