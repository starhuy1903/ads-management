import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PageOptionsLocationDto } from './dto/find-all-location.dto';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private prismaService: PrismaService) {}
  create(createLocationDto: CreateLocationDto) {
    return 'This action adds a new location';
  }

  async findAll(pageOptionsLocationDto: PageOptionsLocationDto) {
    const conditions = {
      orderBy: [
        {
          created_time: pageOptionsLocationDto.order,
        },
      ],
      where: {
        district_id: { in: pageOptionsLocationDto?.districts },
        ward_id: { in: pageOptionsLocationDto?.wards },
        type_id: pageOptionsLocationDto?.locationTypeId,
        ad_type_id: pageOptionsLocationDto?.adTypeId,
      },
    };
    const [result, totalCount] = await Promise.all([
      this.prismaService.location.findMany({
        include: {
          panel: true,
        },
        ...conditions,
        skip: pageOptionsLocationDto.skip,
        take: pageOptionsLocationDto.take,
      }),
      this.prismaService.location.count({
        ...conditions,
      }),
    ]);
    return {
      locations: result,
      totalPages: Math.ceil(totalCount / pageOptionsLocationDto.take),
    };
  }

  findOne(id: number) {
    return this.prismaService.location.findFirst({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
