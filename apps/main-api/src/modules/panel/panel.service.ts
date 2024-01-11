import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { PageOptionsPanelDto } from './dto/find-all-panel.dto';
import { PrismaService } from '../../services/prisma/prisma.service';
import {
  EUploadFolder,
  uploadFilesFromFirebase,
} from '../../services/files/upload';
import { deleteFilesFromFirebase } from '../../services/files/delete';
import { PanelStatus, UserRole } from '@prisma/client';

@Injectable()
export class PanelService {
  constructor(private prismaService: PrismaService) {}
  async create(createPanelDto: CreatePanelDto, images?: Express.Multer.File[]) {
    let imageUrls = [];
    try {
      if (images.length) {
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
        width: createPanelDto?.width,
        height: createPanelDto?.height,
        createContractDate: createPanelDto?.createContractDate,
        expiredContractDate: createPanelDto?.expiredContractDate,
        companyEmail: createPanelDto?.companyEmail,
        companyNumber: createPanelDto?.companyNumber,
        status: PanelStatus.DRAFT,
        type: { connect: { id: createPanelDto?.typeId } },
        location: { connect: { id: createPanelDto?.locationId } },
        imageUrls: imageUrls,
      };

      const result = await this.prismaService.panel.create({
        data,
      });

      return result;
    } catch (error) {
      if (!imageUrls.length) await deleteFilesFromFirebase(imageUrls);
      throw new Error(error);
    }
  }

  async findAll(pageOptionsPanelDto: PageOptionsPanelDto, userId: number) {
    // identify user
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
          createdAt: pageOptionsPanelDto.order,
        },
      ],
      where: {
        location: {},
        typeId: pageOptionsPanelDto?.typeId,
        status: pageOptionsPanelDto?.status,
      },
    };

    if (user.role === UserRole.ward_officer) {
      conditions.where.location = {
        wardId: user.wardId,
      };
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
      if (pageOptionsPanelDto.wards) {
        filteredWards = pageOptionsPanelDto.wards.filter((wardId) =>
          allowedWards.includes(wardId),
        );
      }

      conditions.where.location = {
        districtId: user.districtId,
        wardId: { in: filteredWards },
      };
    } else {
      conditions.where.location = {
        districtId: { in: pageOptionsPanelDto?.districts },
        wardId: { in: pageOptionsPanelDto?.wards },
      };
    }

    console.log('conditions', conditions);
    const pageOption =
      pageOptionsPanelDto.page && pageOptionsPanelDto.take
        ? {
            skip: pageOptionsPanelDto.skip,
            take: pageOptionsPanelDto.take,
          }
        : undefined;

    const [result, totalCount] = await Promise.all([
      this.prismaService.panel.findMany({
        include: {
          type: true,
          location: {
            include: {
              district: true,
              ward: true,
              type: true,
              adType: true,
            },
          },
        },
        ...conditions,
        ...pageOption,
      }),
      this.prismaService.panel.count({
        ...conditions,
      }),
    ]);
    return {
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsPanelDto.take),
      totalCount,
    };
  }

  async findAllPanelsByLocation(
    pageOptionsPanelDto: PageOptionsPanelDto,
    locationId: number,
  ) {
    const conditions = {
      orderBy: [
        {
          createdAt: pageOptionsPanelDto.order,
        },
      ],
      where: {
        location: {
          id: locationId,
        },
        typeId: pageOptionsPanelDto.typeId,
        status: pageOptionsPanelDto.status,
      },
    };

    const pageOption =
      pageOptionsPanelDto.page && pageOptionsPanelDto.take
        ? {
            skip: pageOptionsPanelDto.skip,
            take: pageOptionsPanelDto.take,
          }
        : undefined;

    const [result, totalCount] = await Promise.all([
      this.prismaService.panel.findMany({
        include: {
          type: true,
          location: {
            include: {
              district: true,
              ward: true,
              type: true,
              adType: true,
            },
          },
        },
        ...conditions,
        ...pageOption,
      }),
      this.prismaService.panel.count({
        ...conditions,
      }),
    ]);
    return {
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsPanelDto.take),
      totalCount,
    };
  }

  async findAllByCrew(pageOptionsPanelDto: PageOptionsPanelDto) {
    const conditions = {
      orderBy: [
        {
          createdAt: pageOptionsPanelDto.order,
        },
      ],
      where: {
        status: PanelStatus.APPROVED,
      },
    };
    const [result, totalCount] = await Promise.all([
      this.prismaService.panel.findMany({
        include: {
          type: true,
          location: {
            include: {
              district: true,
              ward: true,
              type: true,
              adType: true,
            },
          },
        },
        ...conditions,
      }),
      this.prismaService.panel.count({
        ...conditions,
      }),
    ]);
    return {
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsPanelDto.take),
      totalCount,
    };
  }

  async findOne(id: number) {
    return await this.prismaService.panel.findFirst({
      include: {
        type: true,
        location: {
          include: {
            district: true,
            ward: true,
            type: true,
            adType: true,
          },
        },
      },
      where: {
        id: id,
      },
    });
  }

  async update(
    id: number,
    updatePanelDto: UpdatePanelDto,
    images?: Express.Multer.File[],
  ) {
    let imageUrls = [];
    try {
      if (images.length) {
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
        typeId: updatePanelDto.typeId,
        width: updatePanelDto.width,
        height: updatePanelDto.height,
        locationId: updatePanelDto.locationId,
        createContractDate: updatePanelDto.createContractDate,
        expiredContractDate: updatePanelDto.expiredContractDate,
        companyEmail: updatePanelDto.companyEmail,
        companyNumber: updatePanelDto.companyNumber,
        imageUrls: undefined,
        belongPanelId: updatePanelDto.belongPanelId,
        status: updatePanelDto.status,
      };

      if (imageUrls.length > 0) {
        updateData.imageUrls = imageUrls;
      }

      const result = await this.prismaService.panel.update({
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
    return await this.prismaService.panel.delete({
      where: {
        id: id,
      },
    });
  }
}
