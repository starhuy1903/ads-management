import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { UpdateUserDto } from '../auth/dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

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
}
