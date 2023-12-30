import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
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
      throw new HttpException(
        {
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
        success: false,
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
        success: true,
        message: 'Update user info successfully',
        user: updatedUser,
      };
    } catch (err) {
      console.log('Error: ', err);
      throw new HttpException(
        {
          success: false,
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
