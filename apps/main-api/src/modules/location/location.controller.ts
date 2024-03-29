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
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PageOptionsLocationDto } from './dto/find-all-location.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type
import { PanelService } from '../panel/panel.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FILE_TYPES_REGEX } from '../../constants/images';
import { JwtGuard, RolesGuard } from '../auth/guards';
import { IRequestWithUser } from '../auth/interfaces';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators';
import { PageOptionsPanelDto } from '../panel/dto/find-all-panel.dto';

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
        statusCode: error.status || 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Get()
  @UseGuards(JwtGuard)
  async findAll(
    @Req() req: IRequestWithUser,
    @Query() pageOptionsLocationDto: PageOptionsLocationDto,
  ) {
    try {
      const userId = req.user['sub'];
      return await this.locationService.findAll(pageOptionsLocationDto, userId);
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

  @Get('map')
  async findAllByCrew(@Query() pageOptionsLocationDto: PageOptionsLocationDto) {
    try {
      return await this.locationService.findAllByCrew(pageOptionsLocationDto);
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

  @Get(':id/panels')
  async findAllPanelByLocation(
    @Query() pageOptionsPanelDto: PageOptionsPanelDto,
    @Param('id') id: string,
  ) {
    try {
      return await this.panelService.findAllPanelsByLocation(
        pageOptionsPanelDto,
        +id,
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
      const location = await this.locationService.findOne(+id);
      return res.success({ data: location });
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
  @UseInterceptors(FilesInterceptor('images', 2))
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
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
      const updatedLocation = await this.locationService.update(
        +id,
        updateLocationDto,
        images,
      );
      return res.success({
        data: updatedLocation,
        message: 'Location updated successfully',
      });
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
      await this.locationService.remove(+id);
      return res.success({ message: 'Location deleted successfully' });
    } catch (error) {
      return res.error({
        statusCode: error.status || 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
