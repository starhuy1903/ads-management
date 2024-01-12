import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  CreateAdsRequestDto,
  CreateAdsRequestUpdateLocationDto,
  CreateAdsRequestUpdatePanelDto,
} from './dto/create-ads-request.dto';
import { UpdateAdsRequestDto } from './dto/update-ads-request.dto';
import { AdsRequestStatus, TargetType } from '../../constants/ads_request';
import { PrismaService } from '../../services/prisma/prisma.service';
import { PageOptionsAdsRequestDto } from './dto/find-all-ads-request.dto';
import {
  AdsRequestType,
  LocationStatus,
  PanelStatus,
  UserRole,
} from '@prisma/client';
import {
  EUploadFolder,
  uploadFilesFromFirebase,
} from '../../services/files/upload';
import { deleteFilesFromFirebase } from '../../services/files/delete';
import { isNil } from 'lodash';

@Injectable()
export class AdsRequestService {
  constructor(private prismaService: PrismaService) {}
  async create(createAdsRequestDto: CreateAdsRequestDto) {
    const data = {
      user: { connect: { id: createAdsRequestDto.userId } },
      targetType: TargetType.PANEL,
      type: AdsRequestType.APPROVED_PANEL,
      reason: createAdsRequestDto.reason,
      status: AdsRequestStatus.PENDING,
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
        fullAddress: createAdsRequestDto?.fullAddress,
        type: { connect: { id: createAdsRequestDto?.typeId } },
        adType: { connect: { id: createAdsRequestDto?.adsTypeId } },
        imageUrls: undefined,
        name: createAdsRequestDto?.name,
        location: { connect: { id: createAdsRequestDto?.belongLocationId } },
        status: LocationStatus.AWAITING_UPDATE,
      };

      if (!imageUrls.length) {
        locationData.imageUrls = createAdsRequestDto.imgUrls;
      } else {
        locationData.imageUrls = imageUrls;
      }

      const result = await this.prismaService.ads_request.create({
        data: {
          user: { connect: { id: createAdsRequestDto.userId } },
          targetType: TargetType.LOCATION,
          type: AdsRequestType.UPDATE_DATA,
          reason: createAdsRequestDto.reason,
          status: AdsRequestStatus.PENDING,
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
        createContractDate: createAdsRequestDto?.createContractDate,
        expiredContractDate: createAdsRequestDto?.expiredContractDate,
        companyEmail: createAdsRequestDto?.companyEmail,
        companyNumber: createAdsRequestDto?.companyNumber,
        status: PanelStatus.AWAITING_UPDATE,
        type: { connect: { id: createAdsRequestDto?.typeId } },
        location: { connect: { id: createAdsRequestDto?.locationId } },
        imageUrls: undefined,
        panel: { connect: { id: createAdsRequestDto?.belongPanelId } },
      };

      if (!imageUrls.length) {
        panelData.imageUrls = createAdsRequestDto.imgUrls;
      } else {
        panelData.imageUrls = imageUrls;
      }

      const result = await this.prismaService.ads_request.create({
        data: {
          user: { connect: { id: createAdsRequestDto.userId } },
          targetType: TargetType.PANEL,
          type: AdsRequestType.UPDATE_DATA,
          reason: createAdsRequestDto.reason,
          status: AdsRequestStatus.PENDING,
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

  async findAll(
    pageOptionsAdsRequestDto: PageOptionsAdsRequestDto,
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

    const conditions = {
      orderBy: [
        {
          createdAt: pageOptionsAdsRequestDto.order,
        },
      ],
      where: {
        OR: undefined,
        type: pageOptionsAdsRequestDto.type,
        targetType: pageOptionsAdsRequestDto.targetType,
        status: pageOptionsAdsRequestDto.status,
      },
    };

    if (user.role === UserRole.ward_officer) {
      conditions.where.OR = [
        {
          location: {
            wardId: user.wardId,
          },
        },
        {
          panel: {
            location: {
              wardId: user.wardId,
            },
          },
        },
      ];
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
      if (pageOptionsAdsRequestDto.wards) {
        filteredWards = pageOptionsAdsRequestDto.wards.filter((wardId) =>
          allowedWards.includes(wardId),
        );
      }

      conditions.where.OR = [
        {
          location: {
            districtId: user.districtId,
            wardId: { in: filteredWards },
          },
        },
        {
          panel: {
            location: {
              districtId: user.districtId,
              wardId: { in: filteredWards },
            },
          },
        },
      ];
    } else {
      conditions.where.OR = [
        {
          location: {
            districtId: { in: pageOptionsAdsRequestDto?.districts },
            wardId: { in: pageOptionsAdsRequestDto?.wards },
          },
        },
        {
          panel: {
            location: {
              districtId: { in: pageOptionsAdsRequestDto?.districts },
              wardId: { in: pageOptionsAdsRequestDto?.wards },
            },
          },
        },
      ];
    }

    const [result, totalCount] = await Promise.all([
      this.prismaService.ads_request.findMany({
        include: {
          user: {
            include: {
              district: true,
              ward: {
                include: {
                  district: true,
                },
              },
            },
          },
          location: {
            include: {
              district: true,
              ward: true,
              type: true,
              adType: true,
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
                  adType: true,
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
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsAdsRequestDto.take),
      totalCount,
    };
  }

  findOne(id: number) {
    return this.prismaService.ads_request.findFirst({
      include: {
        user: {
          include: {
            district: true,
            ward: {
              include: {
                district: true,
              },
            },
          },
        },
        location: {
          include: {
            district: true,
            ward: true,
            type: true,
            adType: true,
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
                adType: true,
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

  async approveRequest(id: number) {
    let oldImageUrls: string[] = [];
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const adsRequest = await tx.ads_request.findFirst({
          include: {
            location: {
              include: {
                location: {},
              },
            },
            panel: {
              include: {
                panel: {},
              },
            },
          },
          where: {
            id: id,
          },
        });

        if (
          isNil(adsRequest) ||
          [
            AdsRequestStatus.APPROVED,
            AdsRequestStatus.CANCELED,
            AdsRequestStatus.REJECTED,
          ].includes(adsRequest.status as AdsRequestStatus)
        ) {
          return false; // TODO: return message instead
        }

        if (adsRequest.type === AdsRequestType.UPDATE_DATA) {
          if (
            adsRequest.targetType === TargetType.PANEL &&
            !isNil(adsRequest.panel)
          ) {
            const newPanel = adsRequest.panel;

            if (!isNil(newPanel.panel)) {
              oldImageUrls = [...newPanel.panel.imageUrls];
              await tx.panel.update({
                where: {
                  id: newPanel.panel.id,
                },
                data: {
                  width: newPanel.width,
                  height: newPanel.height,
                  typeId: newPanel.typeId,
                  locationId: newPanel.locationId,
                  imageUrls: [...newPanel.imageUrls],
                  createContractDate: newPanel.createContractDate,
                  expiredContractDate: newPanel.expiredContractDate,
                  companyEmail: newPanel.companyEmail,
                  companyNumber: newPanel.companyNumber,
                },
              });

              await tx.ads_request.update({
                where: {
                  id: adsRequest.id,
                },
                data: {
                  status: AdsRequestStatus.APPROVED,
                  panelId: newPanel.panel.id,
                },
              });

              await tx.panel.delete({
                where: {
                  id: newPanel.id,
                },
              });
            }
          } else if (
            adsRequest.targetType === TargetType.LOCATION &&
            !isNil(adsRequest.location)
          ) {
            const newLocation = adsRequest.location;

            if (!isNil(newLocation.location)) {
              oldImageUrls = [...newLocation.location.imageUrls];
              await tx.location.update({
                where: {
                  id: newLocation.location.id,
                },
                data: {
                  lat: newLocation.lat,
                  long: newLocation.long,
                  isPlanning: newLocation.isPlanning,
                  districtId: newLocation.districtId,
                  wardId: newLocation.wardId,
                  fullAddress: newLocation.fullAddress,
                  typeId: newLocation.typeId,
                  adTypeId: newLocation.adTypeId,
                  imageUrls: [...newLocation.imageUrls],
                  name: newLocation.name,
                },
              });

              await tx.ads_request.update({
                where: {
                  id: adsRequest.id,
                },
                data: {
                  status: AdsRequestStatus.APPROVED,
                  locationId: newLocation.location.id,
                },
              });

              await tx.location.delete({
                where: {
                  id: newLocation.id,
                },
              });
            }
          }
        } else if (adsRequest.type === AdsRequestType.APPROVED_PANEL) {
          if (!isNil(adsRequest.panel)) {
            await tx.panel.update({
              where: {
                id: adsRequest.panel.id,
              },
              data: {
                status: PanelStatus.APPROVED,
              },
            });
          }

          await tx.ads_request.update({
            where: {
              id: adsRequest.id,
            },
            data: {
              status: AdsRequestStatus.APPROVED,
            },
          });
        }

        await deleteFilesFromFirebase(oldImageUrls);
        return true;
      });
    } catch (e) {
      // rollback already
      // silent
      console.error('error: ', e);
      return false;
    }
  }

  async rejectRequest(id: number) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const adsRequest = await tx.ads_request.findFirst({
          where: {
            id: id,
          },
        });

        if (
          isNil(adsRequest) ||
          [
            AdsRequestStatus.APPROVED,
            AdsRequestStatus.CANCELED,
            AdsRequestStatus.REJECTED,
          ].includes(adsRequest.status as AdsRequestStatus)
        ) {
          return false; // TODO: return message instead
        }

        await tx.ads_request.update({
          where: {
            id: adsRequest.id,
          },
          data: {
            status: AdsRequestStatus.REJECTED,
          },
        });

        return true;
      });
    } catch (e) {
      // rollback already
      // silent
      console.error('error: ', e);
      return false;
    }
  }
}
