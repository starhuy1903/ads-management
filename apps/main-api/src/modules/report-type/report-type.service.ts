import { Injectable } from '@nestjs/common';
import { CreateReportTypeDto } from './dto/create-report-type.dto';
import { UpdateReportTypeDto } from './dto/update-report-type.dto';
import { PageOptionsReportTypeDto } from './dto/find-all-report-type.dto';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class ReportTypeService {
  constructor(private prismaService: PrismaService) {}
  async create(createReportTypeDto: CreateReportTypeDto) {
    const data = {
      name: createReportTypeDto.name,
    };

    return await this.prismaService.report_type.create({
      data,
    });
  }

  async findAll(pageOptionsReportTypeDto: PageOptionsReportTypeDto) {
    const [result, totalCount] = await Promise.all([
      this.prismaService.report_type.findMany({
        skip: pageOptionsReportTypeDto.skip,
        take: pageOptionsReportTypeDto.take,
      }),
      this.prismaService.report_type.count({}),
    ]);
    return {
      reportTypes: result,
      totalPages: Math.ceil(totalCount / pageOptionsReportTypeDto.take),
    };
  }

  findOne(id: number) {
    return this.prismaService.report_type.findFirst({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateReportTypeDto: UpdateReportTypeDto) {
    return this.prismaService.report_type.update({
      where: {
        id: id,
      },
      data: {
        name: updateReportTypeDto.name,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.report_type.delete({
      where: {
        id: id,
      },
    });
  }
}
