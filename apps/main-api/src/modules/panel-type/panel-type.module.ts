import { Module } from '@nestjs/common';
import { PanelTypeService } from './panel-type.service';
import { PanelTypeController } from './panel-type.controller';

@Module({
  controllers: [PanelTypeController],
  providers: [PanelTypeService],
})
export class PanelTypeModule {}
