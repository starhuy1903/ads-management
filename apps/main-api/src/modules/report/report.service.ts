import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from '../../services/prisma/prisma.service';
import { ReportStatus } from '../../constants/report';
import { PageOptionsReportDto } from './dto/find-all-report.dto';
import { TargetType } from '../../constants/ads_request';
import {
  EUploadFolder,
  uploadFilesFromFirebase,
} from '../../services/files/upload';
import { deleteFilesFromFirebase } from '../../services/files/delete';
import { PageOptionsUserReportDto } from './dto/find-all-user-report.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationType } from '../../constants/notification';
import { EDateType, GetStatisticDto } from './dto/get-statistic.dto';
import moment from 'moment-timezone';

@Injectable()
export class ReportService {
  constructor(
    private prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(
    createReportDto: CreateReportDto,
    images?: Express.Multer.File[],
  ) {
    let imageUrls = [];
    try {
      if (images.length) {
        const uploadImagesData = await uploadFilesFromFirebase(
          images,
          EUploadFolder.report,
        );
        if (!uploadImagesData.success) {
          throw new Error('Failed to upload images!');
        }
        imageUrls = uploadImagesData.urls;
      }

      const data = {
        email: createReportDto.email,
        target_type: createReportDto.targetType,
        report_type: { connect: { id: createReportDto.typeId } },
        image_url: imageUrls,
        content: createReportDto.content,
        fullname: createReportDto.fullName,
        user_uuid: createReportDto.userUuid,
        resolved_content: '',
        status: ReportStatus.NEW,
        location: undefined,
        panel: undefined,
      };
      if (createReportDto.targetType == TargetType.LOCATION) {
        data.location = { connect: { id: createReportDto.locationId } };
      } else {
        data.panel = { connect: { id: createReportDto.panelId } };
      }
      const result = await this.prismaService.report.create({
        data,
      });

      try {
        this.eventEmitter.emit(NotificationType.new_report, { result });
      } catch (notificationError) {
        // silent
        console.error('Fail to push notification!!!');
      }

      return result;
    } catch (error) {
      if (imageUrls) await deleteFilesFromFirebase(imageUrls);
      throw new Error(error);
    }
  }

  async findAll(pageOptionsReportDto: PageOptionsReportDto) {
    const conditions = {
      orderBy: [
        {
          createdAt: pageOptionsReportDto.order,
        },
      ],
      where: {
        type_id: pageOptionsReportDto.typeId,
        target_type: pageOptionsReportDto.targetType,
        status: pageOptionsReportDto.status,
        location: undefined,
        panel: undefined,
      },
    };

    if (pageOptionsReportDto.targetType == TargetType.LOCATION) {
      conditions.where.location = {
        district_id: { in: pageOptionsReportDto?.districts },
        ward_id: { in: pageOptionsReportDto?.wards },
      };
    } else if (pageOptionsReportDto.targetType == TargetType.PANEL) {
      conditions.where.panel = {
        location: {
          district_id: { in: pageOptionsReportDto?.districts },
          ward_id: { in: pageOptionsReportDto?.wards },
        },
      };
    }

    const [result, totalCount] = await Promise.all([
      this.prismaService.report.findMany({
        include: {
          report_type: true,
          location: {
            include: {
              district: true,
              ward: true,
            },
          },
          panel: {
            include: {
              location: {
                include: {
                  district: true,
                  ward: true,
                },
              },
            },
          },
        },
        ...conditions,
        skip: pageOptionsReportDto.skip,
        take: pageOptionsReportDto.take,
      }),
      this.prismaService.report.count({
        ...conditions,
      }),
    ]);
    return {
      reports: result,
      totalPages: Math.ceil(totalCount / pageOptionsReportDto.take),
    };
  }

  findOne(id: number) {
    return this.prismaService.report.findFirst({
      include: {
        report_type: true,
        location: {
          include: {
            district: true,
            ward: true,
          },
        },
        panel: {
          include: {
            location: {
              include: {
                district: true,
                ward: true,
              },
            },
          },
        },
      },
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return this.prismaService.report.update({
      where: {
        id: id,
      },
      data: {
        resolved_content: updateReportDto?.resolvedContent,
        status: updateReportDto?.status,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.report.delete({
      where: {
        id: id,
      },
    });
  }

  async findAllUserReport(pageOptionsUserReportDto: PageOptionsUserReportDto) {
    const conditions = {
      orderBy: [
        {
          createdAt: pageOptionsUserReportDto.order,
        },
      ],
      where: {
        type_id: pageOptionsUserReportDto.typeId,
        target_type: pageOptionsUserReportDto.targetType,
        status: pageOptionsUserReportDto.status,
        user_uuid: pageOptionsUserReportDto.userUuid,
        location: undefined,
        panel: undefined,
      },
    };

    const [result, totalCount] = await Promise.all([
      this.prismaService.report.findMany({
        include: {
          report_type: true,
          location: {
            include: {
              district: true,
              ward: true,
            },
          },
          panel: {
            include: {
              location: {
                include: {
                  district: true,
                  ward: true,
                },
              },
            },
          },
        },
        ...conditions,
        skip: pageOptionsUserReportDto.skip,
        take: pageOptionsUserReportDto.take,
      }),
      this.prismaService.report.count({
        ...conditions,
      }),
    ]);
    return {
      reports: result,
      totalPages: Math.ceil(totalCount / pageOptionsUserReportDto.take),
    };
  }

  async getStatistic(getStatisticDto: GetStatisticDto) {
    const conditions = {
      where: {
        location: {
          district_id: { in: getStatisticDto?.districtIds },
          ward_id: { in: getStatisticDto?.wardIds },
        },
        createdAt: undefined,
      },
    };

    if (getStatisticDto.dateType === EDateType.MONTH) {
      const startDate = moment(getStatisticDto?.dateValue)
        .startOf('month')
        .utc()
        .toDate();
      const endDate = moment(getStatisticDto?.dateValue)
        .endOf('month')
        .utc()
        .toDate();

      conditions.where.createdAt = {
        gte: startDate,
        lte: endDate,
      };

      const reports = await this.prismaService.report.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      const reportCounts = {
        resolved: Array<number>(endDate.getDate()).fill(0),
        unresolved: Array<number>(endDate.getDate()).fill(0),
      };

      reports.forEach((report) => {
        const reportDate = report.createdAt.getDate() - 1;
        if (report.status === ReportStatus.DONE) {
          reportCounts.resolved[reportDate]++;
        } else {
          reportCounts.unresolved[reportDate]++;
        }
      });

      return reportCounts;
    } else if (getStatisticDto.dateType === EDateType.YEAR) {
      const startDate = moment(getStatisticDto?.dateValue)
        .startOf('year')
        .utc()
        .toDate();
      const endDate = moment(getStatisticDto?.dateValue)
        .endOf('year')
        .utc()
        .toDate();

      const conditions = {
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      };

      const reports = await this.prismaService.report.findMany(conditions);

      const reportCounts = {
        resolved: Array<number>(12).fill(0),
        unresolved: Array<number>(12).fill(0),
      };

      reports.forEach((report) => {
        const reportMonth = report.createdAt.getMonth();
        if (report.status === ReportStatus.DONE) {
          reportCounts.resolved[reportMonth]++;
        } else {
          reportCounts.unresolved[reportMonth]++;
        }
      });

      return reportCounts;
    }
  }
}
