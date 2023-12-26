import { Injectable } from '@nestjs/common';
import {
  CreateAdsRequestDto,
  CreateAdsRequestUpdateLocationDto,
  CreateAdsRequestUpdatePanelDto,
} from './dto/create-ads-request.dto';
import { UpdateAdsRequestDto } from './dto/update-ads-request.dto';
import { AdsRequestStatus, TargetType } from '../../constants/ads_request';
import { PrismaService } from '../../services/prisma/prisma.service';
import { PageOptionsAdsRequestDto } from './dto/find-all-ads-request.dto';
import { AdsRequestType, LocationStatus, PanelStatus } from '@prisma/client';
import {
  EUploadFolder,
  uploadFilesFromFirebase,
} from '../../services/files/upload';
import { deleteFilesFromFirebase } from '../../services/files/delete';

@Injectable()
export class AdsRequestService {
  constructor(private prismaService: PrismaService) {}
  async create(createAdsRequestDto: CreateAdsRequestDto) {
    const data = {
      user: { connect: { id: createAdsRequestDto.userId } },
      target_type: TargetType.PANEL,
      type: AdsRequestType.APPROVED_PANEL,
      reason: createAdsRequestDto.reason,
      status: AdsRequestStatus.SENT,
      panel: { connect: { id: createAdsRequestDto.panelId } },
    };

    return await this.prismaService.ads_request.create({
      data,
    });
  }

  async createUpdateLocation(
    createAdsRequestDto: CreateAdsRequestUpdateLocationDto,
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

      const locationData = {
        long: createAdsRequestDto?.long,
        lat: createAdsRequestDto?.lat,
        isPlanning: createAdsRequestDto?.isPlanning,
        district: { connect: { id: createAdsRequestDto?.districtId } },
        ward: { connect: { id: createAdsRequestDto?.wardId } },
        full_address: createAdsRequestDto?.fullAddress,
        type: { connect: { id: createAdsRequestDto?.typeId } },
        ad_type: { connect: { id: createAdsRequestDto?.adsTypeId } },
        image_urls: undefined,
        name: createAdsRequestDto?.name,
        location: { connect: { id: createAdsRequestDto?.belongLocationId } },
        status: LocationStatus.AWAITING_UPDATE,
      };

      if (!imageUrls.length) {
        locationData.image_urls = createAdsRequestDto.imgUrls;
      } else {
        locationData.image_urls = imageUrls;
      }

      const result = await this.prismaService.ads_request.create({
        data: {
          user: { connect: { id: createAdsRequestDto.userId } },
          target_type: TargetType.LOCATION,
          type: AdsRequestType.UPDATE_DATA,
          reason: createAdsRequestDto.reason,
          status: AdsRequestStatus.SENT,
          location: {
            create: locationData,
          },
        },
      });

      return result;
    } catch (error) {
      if (!imageUrls.length) await deleteFilesFromFirebase(imageUrls);
      throw new Error(error);
    }
  }

  async createUpdatePanel(
    createAdsRequestDto: CreateAdsRequestUpdatePanelDto,
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

      const panelData = {
        width: createAdsRequestDto?.width,
        height: createAdsRequestDto?.height,
        create_contract_date: createAdsRequestDto?.createContractDate,
        expired_contract_date: createAdsRequestDto?.expiredContractDate,
        company_email: createAdsRequestDto?.companyEmail,
        company_number: createAdsRequestDto?.companyNumber,
        status: PanelStatus.AWAITING_UPDATE,
        type: { connect: { id: createAdsRequestDto?.typeId } },
        location: { connect: { id: createAdsRequestDto?.locationId } },
        image_urls: undefined,
        panel: { connect: { id: createAdsRequestDto?.belongPanelId } },
      };

      if (!imageUrls.length) {
        panelData.image_urls = createAdsRequestDto.imgUrls;
      } else {
        panelData.image_urls = imageUrls;
      }

      const result = await this.prismaService.ads_request.create({
        data: {
          user: { connect: { id: createAdsRequestDto.userId } },
          target_type: TargetType.PANEL,
          type: AdsRequestType.UPDATE_DATA,
          reason: createAdsRequestDto.reason,
          status: AdsRequestStatus.SENT,
          panel: {
            create: panelData,
          },
        },
      });

      return result;
    } catch (error) {
      if (!imageUrls.length) await deleteFilesFromFirebase(imageUrls);
      throw new Error(error);
    }
  }

  async findAll(pageOptionsAdsRequestDto: PageOptionsAdsRequestDto) {
    const conditions = {
      orderBy: [
        {
          createdAt: pageOptionsAdsRequestDto.order,
        },
      ],
      where: {
        type: pageOptionsAdsRequestDto.type,
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
        include: {
          user: true,
          location: {
            include: {
              district: true,
              ward: true,
              type: true,
              ad_type: true,
            },
          },
          panel: {
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
          },
        },
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
      include: {
        user: true,
        location: {
          include: {
            district: true,
            ward: true,
            type: true,
            ad_type: true,
          },
        },
        panel: {
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
        },
      },
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
