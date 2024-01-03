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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LocationTypeService } from './location-type.service';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';
import { UpdateLocationTypeDto } from './dto/update-location-type.dto';
import { PageOptionsLocationTypeDto } from './dto/find-all-location-type.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators';
import { JwtGuard } from '../auth/guards';

@Controller('location-types')
export class LocationTypeController {
  constructor(private readonly locationTypeService: LocationTypeService) {}

  @Post()
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
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
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo, UserRole.ward_officer, UserRole.district_officer)
  async findAll(
    @Query() pageOptionsLocationTypeDto: PageOptionsLocationTypeDto,
  ) {
    try {
      if (
        !pageOptionsLocationTypeDto.take ||
        !pageOptionsLocationTypeDto.page
      ) {
        return await this.locationTypeService.findAllWithoutPagination();
      }
      return await this.locationTypeService.findAll(pageOptionsLocationTypeDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
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
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
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
