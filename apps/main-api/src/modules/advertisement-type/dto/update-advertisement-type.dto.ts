import { PartialType } from '@nestjs/mapped-types';
import { CreateAdvertisementTypeDto } from './create-advertisement-type.dto';

export class UpdateAdvertisementTypeDto extends PartialType(
  CreateAdvertisementTypeDto,
) {}
