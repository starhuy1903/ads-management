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
import { ReportTypeService } from './report-type.service';
import { CreateReportTypeDto } from './dto/create-report-type.dto';
import { UpdateReportTypeDto } from './dto/update-report-type.dto';
import { PageOptionsReportTypeDto } from './dto/find-all-report-type.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators';
import { JwtGuard } from '../auth/guards';

@Controller('report-types')
export class ReportTypeController {
  constructor(private readonly reportTypeService: ReportTypeService) {}

  @Post()
  @UseGuards(JwtGuard)
  @Roles(UserRole.DEPARTMENT_OFFICER)
  async create(
    @Body() createReportTypeDto: CreateReportTypeDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const reportType = await this.reportTypeService.create(
        createReportTypeDto,
      );
      return res.success({
        data: reportType,
        message: 'ReportType created successfully',
      });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Get()
  async findAll(@Query() pageOptionsReportTypeDto: PageOptionsReportTypeDto) {
    try {
      return await this.reportTypeService.findAll(pageOptionsReportTypeDto);
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
  @Roles(UserRole.DEPARTMENT_OFFICER)
  async update(
    @Param('id') id: string,
    @Body() updateReportTypeDto: UpdateReportTypeDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const updatedReportType = await this.reportTypeService.update(
        +id,
        updateReportTypeDto,
      );
      return res.success({
        data: updatedReportType,
        message: 'ReportType updated successfully',
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
      await this.reportTypeService.remove(+id);
      return res.success({ message: 'ReportType deleted successfully' });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
