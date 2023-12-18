import { Injectable } from '@nestjs/common';
import { CreatePanelTypeDto } from './dto/create-panel-type.dto';
import { UpdatePanelTypeDto } from './dto/update-panel-type.dto';
import { PageOptionsPanelTypeDto } from './dto/find-all-panel-type.dto';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class PanelTypeService {
  constructor(private prismaService: PrismaService) {}
  async create(createPanelTypeDto: CreatePanelTypeDto) {
    const data = {
      name: createPanelTypeDto.name,
    };

    return await this.prismaService.panel_type.create({
      data,
    });
  }

  async findAll(pageOptionsPanelTypeDto: PageOptionsPanelTypeDto) {
    const [result, totalCount] = await Promise.all([
      this.prismaService.panel_type.findMany({
        skip: pageOptionsPanelTypeDto.skip,
        take: pageOptionsPanelTypeDto.take,
      }),
      this.prismaService.panel_type.count({}),
    ]);
    return {
      panelTypes: result,
      totalPages: Math.ceil(totalCount / pageOptionsPanelTypeDto.take),
    };
  }

  findOne(id: number) {
    return this.prismaService.panel_type.findFirst({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updatePanelTypeDto: UpdatePanelTypeDto) {
    return this.prismaService.panel_type.update({
      where: {
        id: id,
      },
      data: {
        name: updatePanelTypeDto.name,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.panel_type.delete({
      where: {
        id: id,
      },
    });
  }
}
