import { Injectable } from '@nestjs/common';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { PageOptionsWardDto } from './dto/find-all-ward.dto';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class WardService {
  constructor(private prismaService: PrismaService) {}
  async create(createWardDto: CreateWardDto) {
    const data = {
      name: createWardDto.name,
      districtId: createWardDto.districtId,
    };

    return await this.prismaService.ward.create({
      data,
    });
  }

  async findAll(pageOptionsWardDto: PageOptionsWardDto) {
    const [result, totalCount] = await Promise.all([
      this.prismaService.ward.findMany({
        skip: pageOptionsWardDto.skip,
        take: pageOptionsWardDto.take,
      }),
      this.prismaService.ward.count({}),
    ]);
    return {
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsWardDto.take),
      totalCount,
    };
  }

  async findAllWithoutPagination() {
    const result = await this.prismaService.ward.findMany({});
    return {
      data: result,
    };
  }

  findOne(id: number) {
    return this.prismaService.ward.findFirst({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateWardDto: UpdateWardDto) {
    return this.prismaService.ward.update({
      where: {
        id: id,
      },
      data: {
        name: updateWardDto.name,
        districtId: updateWardDto.districtId,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.ward.delete({
      where: {
        id: id,
      },
    });
  }
}
