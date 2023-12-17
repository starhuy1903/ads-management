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
  ParseFilePipeBuilder,
  UploadedFiles,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PageOptionsReportDto } from './dto/find-all-report.dto';
import { CustomResponse } from '../../middlewares';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FILE_TYPES_REGEX } from '../../constants/images';
import { PageOptionsUserReportDto } from './dto/find-all-user-report.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 2))
  async create(
    @Body() createReportDto: CreateReportDto,
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
      const response = await this.reportService.create(createReportDto, images);
      return res.success({ data: response });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message,
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
        message: error.message,
      });
    }
  }

  @Get('/get-me')
  async findAllUserReport(
    @Query() pageOptionsUserReportDto: PageOptionsUserReportDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const reports = await this.reportService.findAllUserReport(
        pageOptionsUserReportDto,
      );
      return res.success({ data: reports });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message,
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
        message: error.message,
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
        message: error.message,
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
        message: error.message,
      });
    }
  }
}
