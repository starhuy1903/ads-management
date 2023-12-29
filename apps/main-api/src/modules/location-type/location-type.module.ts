import { Module } from '@nestjs/common';
import { LocationTypeService } from './location-type.service';
import { LocationTypeController } from './location-type.controller';

@Module({
  controllers: [LocationTypeController],
  providers: [LocationTypeService],
})
export class LocationTypeModule {}
