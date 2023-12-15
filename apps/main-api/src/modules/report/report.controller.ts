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
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PageOptionsReportDto } from './dto/find-all-report.dto';
import { CustomResponse } from '../../middlewares';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(
    @Body() createReportDto: CreateReportDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const response = await this.reportService.create(createReportDto);
      return res.success({ data: response });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Get()
  async findAll(
    @Query() pageOptionsReportDto: PageOptionsReportDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const reports = await this.reportService.findAll(pageOptionsReportDto);
      return res.success({ data: reports });
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
      const report = await this.reportService.findOne(+id);
      return res.success({ data: report });
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
    @Body() updateReportDto: UpdateReportDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const updatedReport = await this.reportService.update(
        +id,
        updateReportDto,
      );
      return res.success({ data: updatedReport });
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
      await this.reportService.remove(+id);
      return res.success({ message: 'Report deleted successfully' });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
