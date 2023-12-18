import { Injectable } from '@nestjs/common';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { PageOptionsPanelDto } from './dto/find-all-panel.dto';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class PanelService {
  constructor(private prismaService: PrismaService) {}
  async create(createPanelDto: CreatePanelDto) {
    return 'This action adds a new panel';
  }

  async findAll(pageOptionsPanelDto: PageOptionsPanelDto) {
    const conditions = {
      orderBy: [
        {
          created_time: pageOptionsPanelDto.order,
        },
      ],
      where: {
        location: {
          district_id: { in: pageOptionsPanelDto?.districts },
          ward_id: { in: pageOptionsPanelDto?.wards },
        },
        type_id: pageOptionsPanelDto.typeId,
      },
    };
    const [result, totalCount] = await Promise.all([
      this.prismaService.panel.findMany({
        include: {
          type: true,
          location: true,
        },
        ...conditions,
        skip: pageOptionsPanelDto.skip,
        take: pageOptionsPanelDto.take,
      }),
      this.prismaService.panel.count({
        ...conditions,
      }),
    ]);
    return {
      panels: result,
      totalPages: Math.ceil(totalCount / pageOptionsPanelDto.take),
    };
  }

  async findAllPanelsByLocation(
    pageOptionsPanelDto: PageOptionsPanelDto,
    locationId: number,
  ) {
    const conditions = {
      orderBy: [
        {
          created_time: pageOptionsPanelDto.order,
        },
      ],
      where: {
        location: {
          id: locationId,
        },
        type_id: pageOptionsPanelDto.typeId,
      },
    };
    const [result, totalCount] = await Promise.all([
      this.prismaService.panel.findMany({
        include: {
          type: true,
          location: true,
        },
        ...conditions,
        skip: pageOptionsPanelDto.skip,
        take: pageOptionsPanelDto.take,
      }),
      this.prismaService.panel.count({
        ...conditions,
      }),
    ]);
    return {
      panels: result,
      totalPages: Math.ceil(totalCount / pageOptionsPanelDto.take),
    };
  }

  async findOne(id: number) {
    return this.prismaService.panel.findFirst({
      include: {
        type: true,
        location: true,
      },
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updatePanelDto: UpdatePanelDto) {
    return `This action updates a #${id} panel`;
  }

  async remove(id: number) {
    return `This action removes a #${id} panel`;
  }
}
