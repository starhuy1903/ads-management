import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PageOptionsLocationDto } from './dto/find-all-location.dto';
import { PrismaService } from '../../services/prisma/prisma.service';
import {
  EUploadFolder,
  uploadFilesFromFirebase,
} from '../../services/files/upload';
import { deleteFilesFromFirebase } from '../../services/files/delete';
import { LocationStatus } from '@prisma/client';

@Injectable()
export class LocationService {
  constructor(private prismaService: PrismaService) {}
  async create(
    createLocationDto: CreateLocationDto,
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

      const data = {
        long: createLocationDto?.long,
        lat: createLocationDto?.lat,
        isPlanning: createLocationDto?.isPlanning,
        district: { connect: { id: createLocationDto?.districtId } },
        ward: { connect: { id: createLocationDto?.wardId } },
        full_address: createLocationDto?.fullAddress,
        type: { connect: { id: createLocationDto?.typeId } },
        ad_type: { connect: { id: createLocationDto?.adsTypeId } },
        image_urls: imageUrls,
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
        status: pageOptionsLocationDto?.status,
      },
    };
    const [result, totalCount] = await Promise.all([
      this.prismaService.location.findMany({
        include: {
          panel: {
            include: {
              type: true,
            },
          },
          type: true,
          ad_type: true,
          district: true,
          ward: true,
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
        ad_type: true,
        district: true,
        ward: true,
      },
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
