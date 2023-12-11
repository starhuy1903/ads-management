import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { ResetPasswordDto, SignInDto, CreateUserDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from './interfaces/ITokenPayload';
// import { MailService } from '../mail/mail.service';
// import { ScheduleMailReq, SchedulePriority } from '../proto/mail-schedule.pb';
import moment from 'moment-timezone';

import dayjs from 'dayjs';

import { user } from '@prisma/client';

const getAccessExpiry = () => dayjs().add(5, 's').toDate();
const getRefreshExpiry = () => dayjs().add(1, 'd').toDate();

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService, // private readonly mailService: MailService,
  ) {}

  async createUser(dto: CreateUserDto) {
    // Check if the email is already taken
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (userExists) {
      throw new HttpException(
        {
          success: false,
          message: 'Email already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate role_id
    const role = await this.prismaService.role.findUnique({
      where: {
        id: dto.role_id,
      },
    });

    if (!role) {
      throw new HttpException(
        {
          success: false,
          message: 'Invalid role',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash password
    const password = await argon.hash(dto.password);
    try {
      // Create new user
      await this.prismaService.user.create({
        data: {
          email: dto.email,
          password: password,
          first_name: dto.first_name,
          last_name: dto.last_name,
          role_id: role.id,
        },
      });

      return {
        success: true,
        message: 'Create user successfully',
      };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException({
            success: false,
            message: 'Credentials taken',
          });
        }
      }

      // Add logger
      console.log(err);

      throw new HttpException(
        {
          success: false,
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handeleSignIn(user: user) {
    const { refreshToken } = await this.getJwtRefreshToken(user.id, user.email);
    const { accessToken } = await this.getJwtAccessToken(user.id, user.email);

    try {
      const hash = await argon.hash(refreshToken);
      const token = await this.prismaService.token.create({
        data: {
          expires_at: getRefreshExpiry(),
          token: hash,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return {
        accessToken,
        refreshToken,
        tokenId: token.id,
        accessTokenExpires: getAccessExpiry(),
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          dob: user.dob,
          role_id: user.role_id,
        },
      };
    } catch (err) {
      throw new HttpException(
        {
          success: false,
          message: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signIn(dto: SignInDto) {
    // Find a user
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // If the there is no user throw exception
    if (!user) {
      throw new ForbiddenException({
        success: false,
        message: 'Credentials incorrect',
      });
    }

    // Compare password
    const isMatch = await argon.verify(user.password, dto.password);

    if (!isMatch) {
      throw new ForbiddenException({
        success: false,
        message: 'Credentials incorrect',
      });
    }

    return await this.handeleSignIn(user);
  }

  async logOut(userId: number, tokenId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new ForbiddenException({
          success: false,
          message: 'User not found',
        });
      }

      // Delete token
      await this.prismaService.token.delete({
        where: {
          id: tokenId,
        },
      });

      return {
        success: true,
        message: 'Log out successfully',
      };
    } catch (err) {
      // Token not found -> Already logged out
      if (err.code === 'P2025') {
        throw new HttpException(
          {
            success: false,
            message: 'Unauthorized',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Add logger
      console.log(err);

      throw new HttpException(
        {
          success: false,
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refresh(refreshToken: string, tokenId: string, payload: ITokenPayload) {
    const foundToken = await this.prismaService.token.findUnique({
      where: {
        id: tokenId,
      },
    });

    if (foundToken == null) {
      // Refresh token is valid but the id is not in database
      // TODO: inform the user with the payload sub
      throw new HttpException(
        {
          success: false,
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isMatch = await argon.verify(foundToken.token ?? '', refreshToken);

    const issuedAt = dayjs.unix(payload.iat);
    const diff = dayjs().diff(issuedAt, 'seconds');

    if (isMatch) {
      return await this.generateTokens(payload, tokenId);
    } else {
      // Less than 1 minute leeway allows refresh for network concurrency
      if (diff < 60 * 1 * 1) {
        console.log('Leeway');
        return await this.generateTokens(payload, tokenId);
      }

      // Refresh token is valid but not in db
      // Possible re-use!!! delete all refresh tokens(sessions) belonging to the sub
      if (payload.sub !== foundToken.user_id) {
        // The sub of the token isn't the id of the token in db
        // Log out all session of this payalod id, reFreshToken has been compromised
        await this.prismaService.token.deleteMany({
          where: {
            user_id: payload.sub,
          },
        });
        throw new HttpException(
          {
            success: false,
            message: 'Forbidden',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      throw new ForbiddenException({
        success: false,
        message: 'Refresh token expired',
      });
    }
  }

  async forgotPassword(email: string) {
    // Find user
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ForbiddenException({
        success: false,
        message: 'User not found',
      });
    }

    // Set the resetting password flag to true
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        reset_password: true,
      },
    });

    // Generate token
    const { verificationToken } = await this.getJwtVerificationToken(
      user.id,
      user.email,
    );

    // Generate verification link
    const verificationLink = `http://localhost:3000/reset-password?token=${verificationToken}`; // Replace with frontend url

    // Send verification email with token
    // Todo: Send email
    // const templateData = {
    //   fullname: user.name,
    //   link: verificationLink,
    // };
    // const data: ScheduleMailReq = {
    //   name: 'Send mail verify account',
    //   priority: SchedulePriority.normal,
    //   time: moment().format(),
    //   maxRetry: 3,
    //   mailInfo: {
    //     toAddresses: [user.email],
    //     ccAddresses: [user.email],
    //     bccAddresses: [user.email],
    //     template: 'change_password_request',
    //     templateData: JSON.stringify(templateData),
    //   },
    // };
    // await this.mailService.scheduleMail(data).toPromise();

    // Currently returning verification link for testing
    return {
      verificationLink,
    };
  }

  async resetPassword(userId: number, newPassword: string) {
    // Find user
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException({
        success: false,
        message: 'User not found',
      });
    }

    if (user.reset_password == false) {
      throw new ForbiddenException({
        success: false,
        message: 'User has not requested for password reset',
      });
    }

    // Hash password
    const hash = await argon.hash(newPassword);

    // Update user password
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hash,
        reset_password: false,
      },
    });

    return {
      success: true,
      message: 'Reset password successfully',
    };
  }

  public async getJwtRefreshToken(sub: number, email: string) {
    const payload: ITokenPayload = { sub, email };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_RT_SECRET,
      expiresIn: process.env.JWT_RT_EXPIRES,
    });
    return {
      refreshToken,
    };
  }

  async getJwtAccessToken(sub: number, email: string) {
    const payload: ITokenPayload = { sub, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_AT_SECRET,
      expiresIn: process.env.JWT_AT_EXPIRES,
    });
    return {
      accessToken,
    };
  }

  async getJwtVerificationToken(sub: number, email: string) {
    const payload: ITokenPayload = { sub, email };
    const verificationToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_VT_SECRET,
      expiresIn: process.env.JWT_VT_EXPIRES,
    });
    return {
      verificationToken,
    };
  }

  private async generateTokens(payload: ITokenPayload, tokenId: string) {
    const { accessToken } = await this.getJwtAccessToken(
      payload.sub,
      payload.email,
    );

    const { refreshToken: newRefreshToken } = await this.getJwtRefreshToken(
      payload.sub,
      payload.email,
    );

    const hash = await argon.hash(newRefreshToken);

    await this.prismaService.token.update({
      where: {
        id: tokenId,
      },
      data: {
        token: hash,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      tokenId: tokenId,
      accessTokenExpires: getAccessExpiry(),
    };
  }
}
