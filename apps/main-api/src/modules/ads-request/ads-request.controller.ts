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
import { AdsRequestService } from './ads-request.service';
import { CreateAdsRequestDto } from './dto/create-ads-request.dto';
import { UpdateAdsRequestDto } from './dto/update-ads-request.dto';
import { PageOptionsAdsRequestDto } from './dto/find-all-ads-request.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type

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

  @Get()
  async findAll(
    @Query() pageOptionsAdsRequestDto: PageOptionsAdsRequestDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const adsRequests = await this.adsRequestService.findAll(
        pageOptionsAdsRequestDto,
      );
      return res.success({ data: adsRequests });
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
      const adsRequest = await this.adsRequestService.findOne(+id);
      return res.success({ data: adsRequest });
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
