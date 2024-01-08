import { Injectable } from '@nestjs/common';
import { UpdateAdvertisementTypeDto } from './dto/update-advertisement-type.dto';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CreateAdvertisementTypeDto } from './dto/create-advertisement-type.dto';
import { PageOptionsAdvertisementTypeDto } from './dto/find-all-advertisement-type.dto';

@Injectable()
export class AdvertisementTypeService {
  constructor(private prismaService: PrismaService) {}
  async create(createAdvertisementTypeDto: CreateAdvertisementTypeDto) {
    const data = {
      name: createAdvertisementTypeDto.name,
    };

    return await this.prismaService.advertisement_type.create({
      data,
    });
  }

  async update(
    id: number,
    updateAdvertisementTypeDto: UpdateAdvertisementTypeDto,
  ) {
    return await this.prismaService.advertisement_type.update({
      where: {
        id: id,
      },
      data: {
        name: updateAdvertisementTypeDto.name,
      },
    });
  }

  async remove(id: number) {
    return await this.prismaService.advertisement_type.delete({
      where: {
        id: id,
      },
    });
  }

  async findAll(
    pageOptionsAdvertisementTypeDto: PageOptionsAdvertisementTypeDto,
  ) {
    const [result, totalCount] = await Promise.all([
      this.prismaService.advertisement_type.findMany({
        skip: pageOptionsAdvertisementTypeDto.skip,
        take: pageOptionsAdvertisementTypeDto.take,
      }),
      this.prismaService.advertisement_type.count({}),
    ]);
    return {
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsAdvertisementTypeDto.take),
      totalCount,
    };
  }

  findOne(id: number) {
    return this.prismaService.advertisement_type.findFirst({
      where: {
        id: id,
      },
    });
  }
}
