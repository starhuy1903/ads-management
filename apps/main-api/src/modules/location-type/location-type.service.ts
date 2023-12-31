import { Injectable } from '@nestjs/common';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';
import { UpdateLocationTypeDto } from './dto/update-location-type.dto';
import { PageOptionsLocationTypeDto } from './dto/find-all-location-type.dto';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class LocationTypeService {
  constructor(private prismaService: PrismaService) {}
  async create(createLocationTypeDto: CreateLocationTypeDto) {
    const data = {
      name: createLocationTypeDto.name,
    };

    return await this.prismaService.location_type.create({
      data,
    });
  }

  async findAll(pageOptionsLocationTypeDto: PageOptionsLocationTypeDto) {
    const [result, totalCount] = await Promise.all([
      this.prismaService.location_type.findMany({
        skip: pageOptionsLocationTypeDto.skip,
        take: pageOptionsLocationTypeDto.take,
      }),
      this.prismaService.location_type.count({}),
    ]);
    return {
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsLocationTypeDto.take),
      totalCount,
    };
  }

  findOne(id: number) {
    return this.prismaService.location_type.findFirst({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateLocationTypeDto: UpdateLocationTypeDto) {
    return this.prismaService.location_type.update({
      where: {
        id: id,
      },
      data: {
        name: updateLocationTypeDto.name,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.location_type.delete({
      where: {
        id: id,
      },
    });
  }
}
