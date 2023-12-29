import { PartialType } from '@nestjs/mapped-types';
import { CreatePanelTypeDto } from './create-panel-type.dto';

export class UpdatePanelTypeDto extends PartialType(CreatePanelTypeDto) {}
