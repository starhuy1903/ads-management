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
  UseInterceptors,
  UploadedFiles,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PageOptionsLocationDto } from './dto/find-all-location.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type
import { PanelService } from '../panel/panel.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FILE_TYPES_REGEX } from '../../constants/images';

@Controller('locations')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly panelService: PanelService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 2))
  async create(
    @Body() createLocationDto: CreateLocationDto,
    @Res() res: CustomResponse,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: FILE_TYPES_REGEX,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    images?: Express.Multer.File[],
  ) {
    try {
      const location = await this.locationService.create(
        createLocationDto,
        images,
      );
      return res.success({
        data: location,
        message: 'Location created successfully',
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
    @Query() pageOptionsLocationDto: PageOptionsLocationDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const locations = await this.locationService.findAll(
        pageOptionsLocationDto,
      );
      return res.success({ data: locations });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Get(':id/panels')
  async findAllPanelByLocation(
    @Query() pageOptionsLocationDto: PageOptionsLocationDto,
    @Res() res: CustomResponse,
    @Param('id') id: string,
  ) {
    try {
      const locations = await this.panelService.findAllPanelsByLocation(
        pageOptionsLocationDto,
        +id,
      );
      return res.success({ data: locations });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      const location = await this.locationService.findOne(+id);
      return res.success({ data: location });
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
    @Body() updateLocationDto: UpdateLocationDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const updatedLocation = await this.locationService.update(
        +id,
        updateLocationDto,
      );
      return res.success({
        data: updatedLocation,
        message: 'Location updated successfully',
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
      await this.locationService.remove(+id);
      return res.success({ message: 'Location deleted successfully' });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
