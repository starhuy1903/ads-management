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
  Sse,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PageOptionsReportDto } from './dto/find-all-report.dto';
import { CustomResponse } from '../../middlewares';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FILE_TYPES_REGEX } from '../../constants/images';
import { PageOptionsUserReportDto } from './dto/find-all-user-report.dto';
import { fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators';
import { JwtGuard } from '../auth/guards';
import { NotificationType } from '../../constants/notification';
import { GetStatisticDto } from './dto/get-statistic.dto';
import { IRequestWithUser } from '../auth/interfaces';
import { UserService } from '../user/user.service';
import { isNil } from 'lodash';

@Controller('reports')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
  @Get('/statistic')
  async getStatistic(
    @Query() getStatisticDto: GetStatisticDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const results = await this.reportService.getStatistic(getStatisticDto);
      return res.success({ data: results });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message,
      });
    }
  }

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
  @UseGuards(JwtGuard)
  async findAll(
    @Req() req: IRequestWithUser,
    @Query() pageOptionsReportDto: PageOptionsReportDto,
  ) {
    try {
      const userId = req.user['sub'];
      return await this.reportService.findAll(pageOptionsReportDto, userId);
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

  @Get('/get-me')
  async findAllUserReport(
    @Query() pageOptionsUserReportDto: PageOptionsUserReportDto,
  ) {
    try {
      return await this.reportService.findAllUserReport(
        pageOptionsUserReportDto,
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

  @Sse('/officer/sse/:userId')
  @UseGuards(JwtGuard)
  @Roles(UserRole.ward_officer)
  @Roles(UserRole.district_officer)
  @Roles(UserRole.cdo)
  async sseCreateNewReport(@Param() params: { userId: string }) {
    const { userId } = params;
    try {
      const user = await this.userService.getUserInfoByUserId(+userId);

      return fromEvent(this.eventEmitter, NotificationType.new_report).pipe(
        map((data) => {
          const report = data['result'];
          const userDistrict = user?.district?.id;
          const userWard = user?.ward?.id;
          if (!isNil(userDistrict)) {
            const reportDistrictId =
              report?.location?.districtId ??
              report?.panel?.location?.districtId ??
              null;

            if (isNil(reportDistrictId)) {
              return null;
            }

            if (reportDistrictId === userDistrict)
              return JSON.stringify({
                data: report,
                type: NotificationType.new_report,
              });
          } else if (!isNil(userWard)) {
            const reportWardId =
              report?.location?.wardId ??
              report?.panel?.location?.wardId ??
              null;

            if (isNil(reportWardId)) {
              return null;
            }

            if (reportWardId === userWard) {
              return JSON.stringify({
                data: report,
                type: NotificationType.new_report,
              });
            }
          }

          return null;
        }),
      );
    } catch (error) {
      console.error('Unexpected notification server error!');
      return null;
    }
  }

  @Sse('/user/sse/:userUuid')
  sseUpdateStatusReport(@Param() params: { userUuid: string }) {
    const { userUuid } = params;
    try {
      return fromEvent(
        this.eventEmitter,
        NotificationType.update_status_report,
      ).pipe(
        map((data) => {
          const report = data['result'];
          if (report?.userUuid === userUuid) {
            return JSON.stringify({
              data: report,
              type: NotificationType.update_status_report,
            });
          } else return null;
        }),
      );
    } catch (error) {
      console.error('Unexpected notification server error!');
      return null;
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
