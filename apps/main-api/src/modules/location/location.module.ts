import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { PanelService } from '../panel/panel.service';

@Module({
  controllers: [LocationController],
  providers: [LocationService, PanelService],
})
export class LocationModule {}
