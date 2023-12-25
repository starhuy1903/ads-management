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
        create_contract_date: createPanelDto?.createContractDate,
        expired_contract_date: createPanelDto?.expiredContractDate,
        company_email: createPanelDto?.companyEmail,
        company_number: createPanelDto?.companyNumber,
        status: PanelStatus.DRAFT,
        type: { connect: { id: createPanelDto?.typeId } },
        location: { connect: { id: createPanelDto?.locationId } },
        image_urls: imageUrls,
      };

      const result = await this.prismaService.panel.create({
        data,
      });

      return result;
    } catch (error) {
      if (imageUrls) await deleteFilesFromFirebase(imageUrls);
      throw new Error(error);
    }
  }

  async findAll(pageOptionsPanelDto: PageOptionsPanelDto) {
    const conditions = {
      orderBy: [
        {
          created_time: pageOptionsPanelDto.order,
        },
      ],
      where: {
        location: {
          district_id: { in: pageOptionsPanelDto?.districts },
          ward_id: { in: pageOptionsPanelDto?.wards },
        },
        type_id: pageOptionsPanelDto?.typeId,
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
              ad_type: true,
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
      panels: result,
      totalPages: Math.ceil(totalCount / pageOptionsPanelDto.take),
    };
  }

  async findAllPanelsByLocation(
    pageOptionsPanelDto: PageOptionsPanelDto,
    locationId: number,
  ) {
    const conditions = {
      orderBy: [
        {
          created_time: pageOptionsPanelDto.order,
        },
      ],
      where: {
        location: {
          id: locationId,
        },
        type_id: pageOptionsPanelDto.typeId,
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
              ad_type: true,
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
      panels: result,
      totalPages: Math.ceil(totalCount / pageOptionsPanelDto.take),
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
            ad_type: true,
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
