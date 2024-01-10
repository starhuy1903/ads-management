import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { PageOptionsDistrictDto } from './dto/find-all-district.dto';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class DistrictService {
  constructor(private prismaService: PrismaService) {}
  async create(createDistrictDto: CreateDistrictDto) {
    const data = {
      name: createDistrictDto.name,
    };

    return await this.prismaService.district.create({
      data,
    });
  }

  async findAll(pageOptionsDistrictDto: PageOptionsDistrictDto) {
    const [result, totalCount] = await Promise.all([
      this.prismaService.district.findMany({
        skip: pageOptionsDistrictDto.skip,
        take: pageOptionsDistrictDto.take,
      }),
      this.prismaService.district.count({}),
    ]);
    return {
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsDistrictDto.take),
      totalCount,
    };
  }

  async findAllWardByDistrict(
    pageOptionsDistrictDto: PageOptionsDistrictDto,
    districtId: number,
  ) {
    const pageOption =
      pageOptionsDistrictDto.page && pageOptionsDistrictDto.take
        ? {
            skip: pageOptionsDistrictDto.skip,
            take: pageOptionsDistrictDto.take,
          }
        : undefined;
    const conditions = {
      orderBy: [
        {
          id: pageOptionsDistrictDto.order,
        },
      ],
      where: {
        districtId: districtId,
      },
    };
    const [result, totalCount] = await Promise.all([
      this.prismaService.ward.findMany({
        ...conditions,
        ...pageOption,
      }),
      this.prismaService.ward.count({ ...conditions }),
    ]);
    return {
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsDistrictDto.take),
      totalCount,
    };
  }

  async findAllWithoutPagination() {
    const result = await this.prismaService.district.findMany({});
    return {
      data: result,
    };
  }

  findOne(id: number) {
    return this.prismaService.district.findFirst({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateDistrictDto: UpdateDistrictDto) {
    return this.prismaService.district.update({
      where: {
        id: id,
      },
      data: {
        name: updateDistrictDto.name,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.district.delete({
      where: {
        id: id,
      },
    });
  }
}
