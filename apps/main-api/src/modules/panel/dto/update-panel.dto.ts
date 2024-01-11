import { PartialType } from '@nestjs/mapped-types';
import { CreatePanelDto } from './create-panel.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PanelStatus } from '@prisma/client';

export class UpdatePanelDto extends PartialType(CreatePanelDto) {
  @IsEnum(PanelStatus)
  @IsOptional()
  readonly status?: PanelStatus;
}
