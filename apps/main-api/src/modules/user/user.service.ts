import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CdoUpdateUserDto, CreateUserDto, UpdateUserDto } from './dto';
import { UserRole } from '@prisma/client';
import { PageOptionsUserDto } from './dto/get-user-list.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    // Check if the email is already taken
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (userExists) {
      throw new BadRequestException({
        message: 'Email already exists',
      });
    }

    // Validate role
    const role = dto.role as UserRole;
    if (!Object.values(UserRole).includes(role)) {
      throw new BadRequestException({
        message: 'Invalid user role',
      });
    }

    // Validate ward and district
    // Check if ward or district is provided for the role
    if (role === UserRole.ward_officer) {
      if (!dto.wardId) {
        throw new BadRequestException({
          message: 'ward_id is required',
        });
      }

      // Check if ward exists in db
      const ward = await this.prismaService.ward.findUnique({
        where: {
          id: dto.wardId,
        },
      });

      if (!ward) {
        throw new BadRequestException({
          message: 'ward_id is invalid',
        });
      }
    }

    if (role === UserRole.district_officer) {
      if (!dto.districtId) {
        throw new BadRequestException({
          message: 'district_id is required',
        });
      }

      // Check if district exists in db
      const district = await this.prismaService.district.findUnique({
        where: {
          id: dto.districtId,
        },
      });

      if (!district) {
        throw new BadRequestException({
          message: 'district_id is invalid',
        });
      }
    }

    // Hash password
    const password = await argon.hash(dto.password);
    try {
      // Create new user
      await this.prismaService.user.create({
        data: {
          email: dto.email,
          password: password,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: role,
          wardId: dto.wardId,
          districtId: dto.districtId,
        },
      });

      return {
        message: 'Create user successfully',
      };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException({
            message: 'Credentials taken',
          });
        }
      }

      // Add logger
      console.log(err);

      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async getUserList(pageOptionsUserDto: PageOptionsUserDto) {
    // Build query conditions
    const conditions = {
      orderBy: [
        {
          createdAt: pageOptionsUserDto.order,
        },
      ],
      where: {
        role: pageOptionsUserDto?.role,
      },
    };

    console.log('conditions', conditions);

    const pageOption =
      pageOptionsUserDto.page && pageOptionsUserDto.take
        ? {
            skip: pageOptionsUserDto.skip,
            take: pageOptionsUserDto.take,
          }
        : undefined;

    const [result, totalCount] = await Promise.all([
      this.prismaService.user.findMany({
        ...conditions,
        ...pageOption,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          dob: true,
          role: true,
          ward: {
            select: {
              id: true,
              name: true,
              district: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          district: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prismaService.user.count({
        ...conditions,
      }),
    ]);
    return {
      data: result,
      totalPages: Math.ceil(totalCount / pageOptionsUserDto.take),
      totalCount,
    };
  }

  async getUserInfo(userId: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          dob: true,
          role: true,
          ward: {
            select: {
              id: true,
              name: true,
              district: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          district: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return user;
    } catch (err) {
      console.log('Error: ', err);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async getUserInfoByUserId(userId: number) {
    return await this.getUserInfo(userId);
  }

  async updateUserInfo(userId: number, dto: UpdateUserDto) {
    // Check if user exists
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException({
        message: 'User not found',
      });
    }

    try {
      // Update user info
      const updatedUser = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          dob: true,
          role: true,
          ward: {
            select: {
              id: true,
              name: true,
              district: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          district: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        user: updatedUser,
      };
    } catch (err) {
      console.log('Error: ', err);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async cdoUpdateUserAccount(
    currentUserId: number,
    userId: number,
    dto: CdoUpdateUserDto,
  ) {
    // Check if user exists
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException({
        message: 'User not found',
      });
    }

    // Check if the update target is the current user
    if (currentUserId === user.id) {
      throw new UnauthorizedException({
        message: 'You cannot update your own account',
      });
    }

    // Validate role
    const role = dto.role as UserRole;
    if (!Object.values(UserRole).includes(role)) {
      throw new BadRequestException({
        message: 'Invalid user role',
      });
    }

    // Build update info
    const updateInfo = {
      role: role,
      wardId: null,
      districtId: null,
    };

    // Validate ward and district
    // Check if ward or district is provided for the role
    if (role === UserRole.ward_officer) {
      if (!dto.wardId) {
        throw new BadRequestException({
          message: 'ward_id is required',
        });
      }

      // Check if ward exists in db
      const ward = await this.prismaService.ward.findUnique({
        where: {
          id: dto.wardId,
        },
      });

      if (!ward) {
        throw new BadRequestException({
          message: 'ward_id is invalid',
        });
      }

      // Update ward id
      updateInfo.wardId = dto.wardId;
    } else if (role === UserRole.district_officer) {
      if (!dto.districtId) {
        throw new BadRequestException({
          message: 'district_id is required',
        });
      }

      // Check if district exists in db
      const district = await this.prismaService.district.findUnique({
        where: {
          id: dto.districtId,
        },
      });

      if (!district) {
        throw new BadRequestException({
          message: 'district_id is invalid',
        });
      }

      // Update district id
      updateInfo.districtId = dto.districtId;
    }

    try {
      // Update user info
      const updatedUser = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          ...updateInfo,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          dob: true,
          role: true,
          ward: {
            select: {
              id: true,
              name: true,
              district: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          district: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        user: updatedUser,
      };
    } catch (err) {
      console.log('Error: ', err);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }
}
