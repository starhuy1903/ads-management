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
  Req,
} from '@nestjs/common';
import { AdvertisementTypeService } from './advertisement-type.service';
import { CreateAdvertisementTypeDto } from './dto/create-advertisement-type.dto';
import { UpdateAdvertisementTypeDto } from './dto/update-advertisement-type.dto';
import { PageOptionsAdvertisementTypeDto } from './dto/find-all-advertisement-type.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators';
import { JwtGuard, RolesGuard } from '../auth/guards';
import { IRequestWithUser } from '../auth/interfaces';

@Controller('advertisement-types')
export class AdvertisementTypeController {
  constructor(
    private readonly advertisementTypeService: AdvertisementTypeService,
  ) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.cdo)
  async create(
    @Body() createAdvertisementTypeDto: CreateAdvertisementTypeDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const advertisementType = await this.advertisementTypeService.create(
        createAdvertisementTypeDto,
      );
      return res.success({
        data: advertisementType,
        message: 'Advertisement type created successfully',
      });
    } catch (error) {
      return res.error({
        statusCode: error.status || 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.cdo)
  async update(
    @Param('id') id: string,
    @Body() updateAdvertisementTypeDto: UpdateAdvertisementTypeDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const advertisementType = await this.advertisementTypeService.update(
        +id,
        updateAdvertisementTypeDto,
      );
      return res.success({ data: advertisementType });
    } catch (error) {
      return res.error({
        statusCode: error.status || 500,
        message: error.message,
      });
    }
  }

  @Get()
  async findAll(
    @Req() req: IRequestWithUser,
    @Query() pageOptionsAdvertisementTypeDto: PageOptionsAdvertisementTypeDto,
  ) {
    try {
      return await this.advertisementTypeService.findAll(
        pageOptionsAdvertisementTypeDto,
      );
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

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      const advertisementType = await this.advertisementTypeService.findOne(
        +id,
      );
      return res.success({ data: advertisementType });
    } catch (error) {
      return res.error({
        statusCode: error.status || 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.cdo)
  async remove(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      await this.advertisementTypeService.remove(+id);
      return res.success({ message: 'Ads request deleted successfully' });
    } catch (error) {
      return res.error({
        statusCode: error.status || 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
