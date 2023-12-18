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
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type

@Controller('panels')
export class PanelController {
  constructor(private readonly panelService: PanelService) {}

  @Post()
  async create(@Body() createPanelDto: CreatePanelDto) {
    try {
      const panel = await this.panelService.create(createPanelDto);
      return {
        success: true,
        data: panel,
        message: 'Panel created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  @Get()
  async findAll(@Query() pageOptionsPanelDto: PageOptionsPanelDto) {
    try {
      const panels = await this.panelService.findAll(pageOptionsPanelDto);
      return { success: true, data: panels };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const panel = await this.panelService.findOne(+id);
      return { success: true, data: panel };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePanelDto: UpdatePanelDto,
  ) {
    try {
      const updatedPanel = await this.panelService.update(+id, updatePanelDto);
      return {
        success: true,
        data: updatedPanel,
        message: 'Panel updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.panelService.remove(+id);
      return { success: true, message: 'Panel deleted successfully' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
}
