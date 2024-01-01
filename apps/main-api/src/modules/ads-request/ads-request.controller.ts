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
  UseInterceptors,
  UploadedFiles,
  ParseFilePipeBuilder,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AdsRequestService } from './ads-request.service';
import {
  CreateAdsRequestDto,
  CreateAdsRequestUpdateLocationDto,
  CreateAdsRequestUpdatePanelDto,
} from './dto/create-ads-request.dto';
import { UpdateAdsRequestDto } from './dto/update-ads-request.dto';
import { PageOptionsAdsRequestDto } from './dto/find-all-ads-request.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators';
import { JwtGuard } from '../auth/guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FILE_TYPES_REGEX } from '../../constants/images';

@Controller('ads-requests')
export class AdsRequestController {
  constructor(private readonly adsRequestService: AdsRequestService) {}

  @Post()
  async create(
    @Body() createAdsRequestDto: CreateAdsRequestDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const adsRequest = await this.adsRequestService.create(
        createAdsRequestDto,
      );
      return res.success({
        data: adsRequest,
        message: 'Ads request created successfully',
      });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Post('update-panel')
  @UseInterceptors(FilesInterceptor('images', 2))
  async createAdsRequestUpdatePanel(
    @Body() createPanelDto: CreateAdsRequestUpdatePanelDto,
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
      const adsRequest = await this.adsRequestService.createUpdatePanel(
        createPanelDto,
        images,
      );
      return res.success({ data: adsRequest });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  @Post('update-location')
  @UseInterceptors(FilesInterceptor('images', 2))
  async createAdsRequestUpdateLocation(
    @Body() createPanelDto: CreateAdsRequestUpdateLocationDto,
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
      const adsRequest = await this.adsRequestService.createUpdateLocation(
        createPanelDto,
        images,
      );
      return res.success({ data: adsRequest });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  @Get()
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
  async findAll(@Query() pageOptionsAdsRequestDto: PageOptionsAdsRequestDto) {
    try {
      return await this.adsRequestService.findAll(pageOptionsAdsRequestDto);
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
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
  async findOne(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      const adsRequest = await this.adsRequestService.findOne(+id);
      return res.success({ data: adsRequest });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Patch('/:id/approve')
  async approveRequest(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      const result = await this.adsRequestService.approveRequest(+id);
      if (result === true) {
        return res.success({ message: 'Ads request approved!' });
      } else {
        return res.error({ message: 'Ads request approve failed!' });
      }
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Patch('/:id/reject')
  async rejectRequest(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      const result = await this.adsRequestService.rejectRequest(+id);
      if (result === true) {
        return res.success({ message: 'Ads request rejected!' });
      } else {
        return res.error({ message: 'Ads request rejected failed!' });
      }
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
  async update(
    @Param('id') id: string,
    @Body() updateAdsRequestDto: UpdateAdsRequestDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const updatedAdsRequest = await this.adsRequestService.update(
        +id,
        updateAdsRequestDto,
      );
      return res.success({
        data: updatedAdsRequest,
        message: 'Ads request updated successfully',
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
      await this.adsRequestService.remove(+id);
      return res.success({ message: 'Ads request deleted successfully' });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
