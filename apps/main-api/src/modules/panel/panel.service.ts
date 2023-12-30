import { Injectable } from '@nestjs/common';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { PageOptionsPanelDto } from './dto/find-all-panel.dto';
import { PrismaService } from '../../services/prisma/prisma.service';
import {
  EUploadFolder,
  uploadFilesFromFirebase,
} from '../../services/files/upload';
import { deleteFilesFromFirebase } from '../../services/files/delete';
import { PanelStatus } from '@prisma/client';

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

  async findAll(pageOptionsPanelDto: PageOptionsPanelDto) {
    const conditions = {
      orderBy: [
        {
          createdAt: pageOptionsPanelDto.order,
        },
      ],
      where: {
        location: {
          districtId: { in: pageOptionsPanelDto?.districts },
          wardId: { in: pageOptionsPanelDto?.wards },
        },
        typeId: pageOptionsPanelDto?.typeId,
        status: pageOptionsPanelDto?.status,
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
        skip: pageOptionsPanelDto.skip,
        take: pageOptionsPanelDto.take,
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
        skip: pageOptionsPanelDto.skip,
        take: pageOptionsPanelDto.take,
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
    return this.prismaService.panel.findFirst({
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

  async update(id: number, updatePanelDto: UpdatePanelDto) {
    return `This action updates a #${id} panel`;
  }

  async remove(id: number) {
    return `This action removes a #${id} panel`;
  }
}
