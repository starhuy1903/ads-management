import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PanelTypeService } from './panel-type.service';
import { CreatePanelTypeDto } from './dto/create-panel-type.dto';
import { UpdatePanelTypeDto } from './dto/update-panel-type.dto';
import { PageOptionsPanelTypeDto } from './dto/find-all-panel-type.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators';
import { JwtGuard } from '../auth/guards';

@Controller('panel-types')
export class PanelTypeController {
  constructor(private readonly panelTypeService: PanelTypeService) {}

  @Post()
  @UseGuards(JwtGuard)
  @Roles(UserRole.DEPARTMENT_OFFICER)
  async create(
    @Body() createPanelTypeDto: CreatePanelTypeDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const panelType = await this.panelTypeService.create(
        createPanelTypeDto,
      );
      return res.success({
        data: panelType,
        message: 'PanelType created successfully',
      });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Get()
  async findAll(
    @Query() pageOptionsPanelTypeDto: PageOptionsPanelTypeDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const panelTypes = await this.panelTypeService.findAll(
        pageOptionsPanelTypeDto,
      );
      return res.success({ data: panelTypes });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.DEPARTMENT_OFFICER)
  async update(
    @Param('id') id: string,
    @Body() updatePanelTypeDto: UpdatePanelTypeDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const updatedPanelType = await this.panelTypeService.update(
        +id,
        updatePanelTypeDto,
      );
      return res.success({
        data: updatedPanelType,
        message: 'PanelType updated successfully',
      });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.DEPARTMENT_OFFICER)
  async remove(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      await this.panelTypeService.remove(+id);
      return res.success({ message: 'PanelType deleted successfully' });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
