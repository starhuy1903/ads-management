import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PanelService } from './panel.service';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { PageOptionsPanelDto } from './dto/find-all-panel.dto';

@Controller('panels')
export class PanelController {
  constructor(private readonly panelService: PanelService) {}

  @Post()
  create(@Body() createPanelDto: CreatePanelDto) {
    return this.panelService.create(createPanelDto);
  }

  @Get()
  findAll(@Query() pageOptionsPanelDto: PageOptionsPanelDto) {
    return this.panelService.findAll(pageOptionsPanelDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.panelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePanelDto: UpdatePanelDto) {
    return this.panelService.update(+id, updatePanelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.panelService.remove(+id);
  }
}
