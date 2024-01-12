import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PageOptionsLocationDto } from './dto/find-all-location.dto';
import { PrismaService } from '../../services/prisma/prisma.service';
import {
  EUploadFolder,
  uploadFilesFromFirebase,
} from '../../services/files/upload';
import { deleteFilesFromFirebase } from '../../services/files/delete';
import { LocationStatus, UserRole } from '@prisma/client';
import { cloneDeep, map } from 'lodash';

@Injectable()
export class LocationService {
  constructor(private prismaService: PrismaService) {}
  async create(
    createLocationDto: CreateLocationDto,
    images?: Express.Multer.File[],
  ) {
    let imageUrls = [];
    try {
      if (images?.length) {
        const uploadImagesData = await uploadFilesFromFirebase(
          images,
          EUploadFolder.report,
        );
        if (!uploadImagesData.success) {
          throw new Error('Failed to upload images!');
        }
        imageUrls = uploadImagesData.urls;
      }

      const data = {
        long: createLocationDto?.long,
        lat: createLocationDto?.lat,
        isPlanning: createLocationDto?.isPlanning,
        district: { connect: { id: createLocationDto?.districtId } },
        ward: { connect: { id: createLocationDto?.wardId } },
        fullAddress: createLocationDto?.fullAddress,
        type: { connect: { id: createLocationDto?.typeId } },
        adType: { connect: { id: createLocationDto?.adsTypeId } },
        imageUrls: imageUrls,
        name: createLocationDto?.name,
        status: LocationStatus.APPROVED,
      };

      const result = await this.prismaService.location.create({
        data,
      });

      return result;
    } catch (error) {
      if (!imageUrls.length) await deleteFilesFromFirebase(imageUrls);
      throw new Error(error);
    }
  }

  async findAll(
    pageOptionsLocationDto: PageOptionsLocationDto,
    userId: number,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
      });
    }

    // Build query conditions
    const conditions = {
      orderBy: [
        {
          createdAt: pageOptionsLocationDto.order,
        },
      ],
      where: {
        districtId: {},
        wardId: {},
        typeId: pageOptionsLocationDto?.locationTypeId,
        adTypeId: pageOptionsLocationDto?.adTypeId,
        status: pageOptionsLocationDto?.status,
      },
    };

    if (user.role === UserRole.ward_officer) {
      conditions.where.wardId = user.wardId;
    } else if (user.role === UserRole.district_officer) {
      // allowedWardIds = [{id: 1}, {id: 2}, {id: 3}, ...]
      const allowedWardIds = await this.prismaService.ward.findMany({
        where: {
          districtId: user.districtId,
        },
        select: {
          id: true,
        },
      });

      // allowedWards = [1, 2, 3, ...]
      const allowedWards = allowedWardIds.map((ward) => ward.id);

      let filteredWards = allowedWards;
      // Filter wards by district -> Only get ward which belong to district
      if (pageOptionsLocationDto.wards) {
        filteredWards = pageOptionsLocationDto.wards.filter((wardId) =>
          allowedWards.includes(wardId),
        );
      }

      conditions.where.districtId = user.districtId;
      conditions.where.wardId = { in: filteredWards };
    } else {
      conditions.where.districtId = { in: pageOptionsLocationDto?.districts };
      conditions.where.wardId = { in: pageOptionsLocationDto?.wards };
    }

    const pageOption =
      pageOptionsLocationDto.page && pageOptionsLocationDto.take
        ? {
            skip: pageOptionsLocationDto.skip,
            take: pageOptionsLocationDto.take,
          }
        : undefined;

    const [result, totalCount] = await Promise.all([
      this.prismaService.location.findMany({
        include: {
          panel: {
            include: {
              type: true,
            },
          },
          type: true,
          adType: true,
          district: true,
          ward: true,
        },
        ...conditions,
        ...pageOption,
      }),
      this.prismaService.location.count({
        ...conditions,
      }),
    ]);
    return {
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsLocationDto.take),
      totalCount,
    };
  }

  async findAllByCrew(pageOptionsLocationDto: PageOptionsLocationDto) {
    const conditions = {
      orderBy: [
        {
          createdAt: pageOptionsLocationDto.order,
        },
      ],
      where: {
        status: LocationStatus.APPROVED,
      },
    };
    const [rawResult, totalCount] = await Promise.all([
      this.prismaService.location.findMany({
        include: {
          panel: {
            include: {
              type: true,
            },
          },
          type: true,
          adType: true,
          district: true,
          ward: true,
        },
        ...conditions,
      }),
      this.prismaService.location.count({
        ...conditions,
      }),
    ]);

    const result = map(rawResult, (item) => {
      const newItem = cloneDeep(item);
      if (newItem.isPlanning === true) {
        newItem.panel = [];
      }
      return newItem;
    });

    return {
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsLocationDto.take),
      totalCount,
    };
  }

  findOne(id: number) {
    return this.prismaService.location.findFirst({
      include: {
        panel: {
          include: {
            type: true,
          },
        },
        type: true,
        adType: true,
        district: true,
        ward: true,
      },
      where: {
        id: id,
      },
    });
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
    images?: Express.Multer.File[],
  ) {
    let imageUrls = [];
    try {
      if (images?.length) {
        const uploadImagesData = await uploadFilesFromFirebase(
          images,
          EUploadFolder.report,
        );
        if (!uploadImagesData.success) {
          throw new Error('Failed to upload images!');
        }
        imageUrls = uploadImagesData.urls;
      }
      const updateData = {
        typeId: updateLocationDto.typeId,
        adTypeId: updateLocationDto.adsTypeId,
        long: updateLocationDto.long,
        lat: updateLocationDto.lat,
        isPlanning: updateLocationDto.isPlanning,
        districtId: updateLocationDto.districtId,
        wardId: updateLocationDto.wardId,
        fullAddress: updateLocationDto.fullAddress,
        name: updateLocationDto.name,
        imageUrls: undefined,
        belongLocationId: updateLocationDto.belongLocationId,
        status: updateLocationDto.status,
      };

      if (imageUrls.length > 0) {
        updateData.imageUrls = imageUrls;
      }

      const result = await this.prismaService.location.update({
        where: {
          id: id,
        },
        data: updateData,
      });

      return result;
    } catch (error) {
      if (!imageUrls.length) await deleteFilesFromFirebase(imageUrls);
      throw new Error(error);
    }
  }

  async remove(id: number) {
    return await this.prismaService.location.delete({
      where: {
        id: id,
      },
    });
  }
}
