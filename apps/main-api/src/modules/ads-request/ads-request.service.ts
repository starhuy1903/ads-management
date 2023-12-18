import { Injectable } from '@nestjs/common';
import { CreateAdsRequestDto } from './dto/create-ads-request.dto';
import { UpdateAdsRequestDto } from './dto/update-ads-request.dto';
import { AdsRequestStatus, TargetType } from '../../constants/ads_request';
import { PrismaService } from '../../services/prisma/prisma.service';
import { PageOptionsAdsRequestDto } from './dto/find-all-ads-request.dto';

@Injectable()
export class AdsRequestService {
  constructor(private prismaService: PrismaService) {}
  async create(createAdsRequestDto: CreateAdsRequestDto) {
    const data = {
      user: { connect: { id: createAdsRequestDto.userId } },
      target_type: createAdsRequestDto.targetType,
      ads_request_type: { connect: { id: createAdsRequestDto.typeId } },
      reason: createAdsRequestDto.reason,
      status: AdsRequestStatus.SENT,
      location: undefined,
      panel: undefined,
    };
    if (createAdsRequestDto.targetType == TargetType.LOCATION) {
      data.location = { connect: { id: createAdsRequestDto.locationId } };
    } else {
      data.panel = { connect: { id: createAdsRequestDto.panelId } };
    }
    return await this.prismaService.ads_request.create({
      data,
    });
  }

  async findAll(pageOptionsAdsRequestDto: PageOptionsAdsRequestDto) {
    const conditions = {
      orderBy: [
        {
          createdAt: pageOptionsAdsRequestDto.order,
        },
      ],
      where: {
        type_id: pageOptionsAdsRequestDto.typeId,
        target_type: pageOptionsAdsRequestDto.targetType,
        status: pageOptionsAdsRequestDto.status,
        location: undefined,
        panel: undefined,
      },
    };

    if (pageOptionsAdsRequestDto.targetType == TargetType.LOCATION) {
      conditions.where.location = {
        district_id: { in: pageOptionsAdsRequestDto?.districts },
        ward_id: { in: pageOptionsAdsRequestDto?.wards },
      };
    } else if (pageOptionsAdsRequestDto.targetType == TargetType.PANEL) {
      conditions.where.panel = {
        location: {
          district_id: { in: pageOptionsAdsRequestDto?.districts },
          ward_id: { in: pageOptionsAdsRequestDto?.wards },
        },
      };
    }

    const [result, totalCount] = await Promise.all([
      this.prismaService.ads_request.findMany({
        ...conditions,
        skip: pageOptionsAdsRequestDto.skip,
        take: pageOptionsAdsRequestDto.take,
      }),
      this.prismaService.ads_request.count({
        ...conditions,
      }),
    ]);
    return {
      adsRequests: result,
      totalPages: Math.ceil(totalCount / pageOptionsAdsRequestDto.take),
    };
  }

  findOne(id: number) {
    return this.prismaService.ads_request.findFirst({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateAdsRequestDto: UpdateAdsRequestDto) {
    return this.prismaService.ads_request.update({
      where: {
        id: id,
      },
      data: {
        status: updateAdsRequestDto?.status,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.ads_request.delete({
      where: {
        id: id,
      },
    });
  }
}
