import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { UserRole } from '@prisma/client';

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
        targetType: createReportDto.targetType,
        reportType: { connect: { id: createReportDto.typeId } },
        imageUrls: imageUrls,
        content: createReportDto.content,
        fullName: createReportDto.fullName,
        userUuid: createReportDto.userUuid,
        resolvedContent: '',
        status: ReportStatus.NEW,
        location: undefined,
        panel: undefined,
      };
      if (createReportDto.targetType == TargetType.LOCATION) {
        data.location = { connect: { id: createReportDto.locationId } };
      } else {
        data.panel = {
          connect: { id: createReportDto.panelId },
        };
      }
      const result = await this.prismaService.report.create({
        data,
        include: {
          location: true,
          panel: { include: { location: true } },
        },
      });

      try {
        this.eventEmitter.emit(NotificationType.new_report, { result });
      } catch (notificationError) {
        // silent
        console.error('Fail to push notification!!!: ', notificationError);
      }

      return result;
    } catch (error) {
      if (imageUrls) await deleteFilesFromFirebase(imageUrls);
      throw new Error(error);
    }
  }

  async findAll(pageOptionsReportDto: PageOptionsReportDto, userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
      });
    }

    const conditions = {
      orderBy: [
        {
          createdAt: pageOptionsReportDto.order,
        },
      ],
      where: {
        OR: undefined,
        typeId: pageOptionsReportDto.typeId,
        targetType: pageOptionsReportDto.targetType,
        status: pageOptionsReportDto.status,
      },
    };

    if (user.role === UserRole.ward_officer) {
      conditions.where.OR = [
        {
          location: {
            wardId: user.wardId,
          },
        },
        {
          panel: {
            location: {
              wardId: user.wardId,
            },
          },
        },
      ];
    } else if (user.role === UserRole.district_officer) {
      // allowedWardIds = [{id: 1}, {id: 2}, {id: 3}, ...]
      const allowedWardIds = await this.prismaService.ward.findMany({
        where: {
          districtId: user.districtId,
        },
        select: {
          id: true,
        },
      });

      // allowedWards = [1, 2, 3, ...]
      const allowedWards = allowedWardIds.map((ward) => ward.id);

      // Filter wards by district -> Only get ward which belong to district
      const filteredWards = pageOptionsReportDto.wards.filter((wardId) =>
        allowedWards.includes(wardId),
      );

      conditions.where.OR = [
        {
          location: {
            districtId: user.districtId,
            wardId: { in: filteredWards },
          },
        },
        {
          panel: {
            location: {
              districtId: user.districtId,
              wardId: { in: filteredWards },
            },
          },
        },
      ];
    } else {
      conditions.where.OR = [
        {
          location: {
            districtId: { in: pageOptionsReportDto?.districts },
            wardId: { in: pageOptionsReportDto?.wards },
          },
        },
        {
          panel: {
            location: {
              districtId: { in: pageOptionsReportDto?.districts },
              wardId: { in: pageOptionsReportDto?.wards },
            },
          },
        },
      ];
    }

    const [result, totalCount] = await Promise.all([
      this.prismaService.report.findMany({
        include: {
          reportType: true,
          location: {
            include: {
              district: true,
              ward: true,
              type: true,
              adType: true,
            },
          },
          panel: {
            include: {
              type: true,
              location: {
                include: {
                  district: true,
                  ward: true,
                  type: true,
                  adType: true,
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
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsReportDto.take),
      totalCount,
    };
  }

  findOne(id: number) {
    return this.prismaService.report.findFirst({
      include: {
        reportType: true,
        location: {
          include: {
            district: true,
            ward: true,
            type: true,
            adType: true,
          },
        },
        panel: {
          include: {
            type: true,
            location: {
              include: {
                district: true,
                ward: true,
                type: true,
                adType: true,
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

  async update(id: number, updateReportDto: UpdateReportDto) {
    const result = await this.prismaService.report.update({
      where: {
        id: id,
      },
      data: {
        resolvedContent: updateReportDto?.resolvedContent,
        status: updateReportDto?.status,
      },
    });

    try {
      this.eventEmitter.emit(NotificationType.update_status_report, { result });
    } catch (notificationError) {
      // silent
      console.error('Fail to push notification!!!: ', notificationError);
    }
    return result;
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
        typeId: pageOptionsUserReportDto.typeId,
        targetType: pageOptionsUserReportDto.targetType,
        status: pageOptionsUserReportDto.status,
        userUuid: pageOptionsUserReportDto.userUuid,
        location: undefined,
        panel: undefined,
      },
    };

    const [result, totalCount] = await Promise.all([
      this.prismaService.report.findMany({
        include: {
          reportType: true,
          location: {
            include: {
              district: true,
              ward: true,
            },
          },
          panel: {
            include: {
              type: true,
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
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsUserReportDto.take),
      totalCount,
    };
  }

  async getStatistic(getStatisticDto: GetStatisticDto) {
    if (getStatisticDto.dateType === EDateType.MONTH) {
      const startDate = moment(getStatisticDto?.dateValue)
        .startOf('month')
        .utc()
        .toDate();
      const endDate = moment(getStatisticDto?.dateValue)
        .endOf('month')
        .utc()
        .toDate();

      const conditions = {
        where: {
          OR: [
            {
              location: {
                districtId: { in: getStatisticDto?.districtIds },
                wardId: { in: getStatisticDto?.wardIds },
              },
            },
            {
              panel: {
                location: {
                  districtId: { in: getStatisticDto?.districtIds },
                  wardId: { in: getStatisticDto?.wardIds },
                },
              },
            },
          ],
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      };

      const reports = await this.prismaService.report.findMany({
        ...conditions,
        include: {
          location: true,
          panel: {
            include: {
              location: true,
            },
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
          location: {
            districtId: { in: getStatisticDto?.districtIds },
            wardId: { in: getStatisticDto?.wardIds },
          },
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
