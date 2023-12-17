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
} from '@nestjs/common';
import { LocationTypeService } from './location-type.service';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';
import { UpdateLocationTypeDto } from './dto/update-location-type.dto';
import { PageOptionsLocationTypeDto } from './dto/find-all-location-type.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type

@Controller('location-types')
export class LocationTypeController {
  constructor(private readonly locationTypeService: LocationTypeService) {}

  @Post()
  async create(
    @Body() createLocationTypeDto: CreateLocationTypeDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const locationType = await this.locationTypeService.create(
        createLocationTypeDto,
      );
      return res.success({
        data: locationType,
        message: 'LocationType created successfully',
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
    @Query() pageOptionsLocationTypeDto: PageOptionsLocationTypeDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const locationTypes = await this.locationTypeService.findAll(
        pageOptionsLocationTypeDto,
      );
      return res.success({ data: locationTypes });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLocationTypeDto: UpdateLocationTypeDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const updatedLocationType = await this.locationTypeService.update(
        +id,
        updateLocationTypeDto,
      );
      return res.success({
        data: updatedLocationType,
        message: 'LocationType updated successfully',
      });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      await this.locationTypeService.remove(+id);
      return res.success({ message: 'LocationType deleted successfully' });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
