import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ReportStatus } from '../constants/report';
import { PageOptionsReportDto } from './dto/find-all-report.dto';
import { TargetType } from '../constants/ads_request';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportService {
  constructor(private prismaService: PrismaService) {}
  async create(createReportDto: CreateReportDto) {
    let data: any = {
      email: createReportDto.email,
      target_type: createReportDto.targetType,
      report_type: { connect: { id: createReportDto.typeId } },
      image_url: createReportDto.imgUrls,
      content: createReportDto.content,
      fullname: createReportDto.fullName,
      resolved_content: '',
      status: ReportStatus.NEW,
    };
    if (createReportDto.targetType == TargetType.LOCATION) {
      data.location = { connect: { id: createReportDto.locationId } };
    } else {
      data.panel = { connect: { id: createReportDto.panelId } };
    }
    return await this.prismaService.report.create({
      data,
    });
  }

  async findAll(pageOptionsReportDto: PageOptionsReportDto) {
    let conditions: any = {
      orderBy: [
        {
          createdAt: pageOptionsReportDto.order,
        },
      ],
      where: {
        type_id: pageOptionsReportDto.typeId,
        target_type: pageOptionsReportDto.targetType,
        status: pageOptionsReportDto.status,
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
    };
  }

  findOne(id: number) {
    return this.prismaService.report.findFirst({
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
}
