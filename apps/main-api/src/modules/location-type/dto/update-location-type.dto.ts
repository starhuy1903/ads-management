import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationTypeDto } from './create-location-type.dto';

export class UpdateLocationTypeDto extends PartialType(CreateLocationTypeDto) {}
