import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { SignInDto, ChangePasswordDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from './interfaces/ITokenPayload';

import { user } from '@prisma/client';
import { SendMailTemplateDto } from '../../services/mail/mail.dto';
import { MailService } from '../../services/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async handleSignIn(user: user) {
    const { refreshToken } = await this.getJwtRefreshToken(
      user.id,
      user.email,
      user.role,
    );
    const { accessToken } = await this.getJwtAccessToken(
      user.id,
      user.email,
      user.role,
    );

    try {
      const hash = await argon.hash(refreshToken);
      const updatedUser = await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken: hash,
        },
      });

      if (!updatedUser) {
        throw new UnauthorizedException({
          message: 'Unauthorized',
        });
      }

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          dob: user.dob,
          role: user.role,
          wardId: user.wardId,
          districtId: user.districtId,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: 'Bad Request',
      });
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
      throw new UnauthorizedException({
        message: 'Wrong email or password',
      });
    }

    // Compare password
    const isMatch = await argon.verify(user.password, dto.password);

    if (!isMatch) {
      throw new UnauthorizedException({
        message: 'Wrong email or password',
      });
    }

    return await this.handleSignIn(user);
  }

  async logOut(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
      });
    }

    // Check if user is already logged out
    if (!user.refreshToken) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
      });
    }

    try {
      // Update user's refresh token to null
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          refreshToken: null,
        },
      });

      return {};
    } catch (err) {
      // Add logger
      console.log(err);

      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async refresh(refreshToken: string, payload: ITokenPayload) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
      });
    }

    // Check if user is already logged out
    if (!user.refreshToken) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
      });
    }

    // Compare refresh token
    const isMatch = await argon.verify(user.refreshToken, refreshToken);

    if (!isMatch) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
      });
    }

    return await this.generateTokens(payload);
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    // Find user
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

    // Check if old password is the same as new password
    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException({
        message: 'New password must be different from old password',
      });
    }

    // Check old password
    const isMatch = await argon.verify(user.password, dto.oldPassword);
    if (!isMatch) {
      throw new UnauthorizedException({
        message: 'Old password is incorrect',
      });
    }

    // Hash new password
    const hash = await argon.hash(dto.newPassword);

    // Update user password
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hash,
        },
      });

      return {};
    } catch (err) {
      // Add logger
      console.log(err);

      throw new InternalServerErrorException({
        message: 'Something went wrong',
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
      throw new UnauthorizedException({
        message: 'Invalid email',
      });
    }

    // Set the resetting password flag to true
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetPassword: true,
      },
    });

    // Generate token
    const { verificationToken } = await this.getJwtVerificationToken(
      user.id,
      user.email,
      user.role,
    );

    // Generate verification link
    const verificationLink = `${process.env.FRONTEND_URL}/reset-password?token=${verificationToken}`; // Replace with frontend url

    // Send verification email with token
    const templateData = {
      fullname: user.firstName + ' ' + user.lastName,
      link: verificationLink,
    };

    const userEmail = user.email;
    const data: SendMailTemplateDto = {
      toAddresses: [userEmail],
      ccAddresses: [userEmail],
      bccAddresses: [userEmail],
      template: 'change_password_request',
      templateData: JSON.stringify(templateData),
    };

    try {
      await this.mailService.sendEmailTemplate(data);

      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'Forgot password email failed to send',
      });
    }
  }

  async resetPassword(userId: number, newPassword: string) {
    // Find user
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
      });
    }

    if (user.resetPassword == false) {
      throw new UnauthorizedException({
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
        resetPassword: false,
      },
    });

    return {};
  }

  public async getJwtRefreshToken(sub: number, email: string, role: string) {
    const payload: ITokenPayload = { sub, email, role };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_RT_SECRET,
      expiresIn: process.env.JWT_RT_EXPIRES,
    });
    return {
      refreshToken,
    };
  }

  async getJwtAccessToken(sub: number, email: string, role: string) {
    const payload: ITokenPayload = { sub, email, role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_AT_SECRET,
      expiresIn: process.env.JWT_AT_EXPIRES,
    });
    return {
      accessToken,
    };
  }

  async getJwtVerificationToken(sub: number, email: string, role: string) {
    const payload: ITokenPayload = { sub, email, role };
    const verificationToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_VT_SECRET,
      expiresIn: process.env.JWT_VT_EXPIRES,
    });
    return {
      verificationToken,
    };
  }

  private async generateTokens(payload: ITokenPayload) {
    const { accessToken } = await this.getJwtAccessToken(
      payload.sub,
      payload.email,
      payload.role,
    );

    const { refreshToken } = await this.getJwtRefreshToken(
      payload.sub,
      payload.email,
      payload.role,
    );

    const hash = await argon.hash(refreshToken);

    await this.prismaService.user.update({
      where: {
        id: payload.sub,
      },
      data: {
        refreshToken: hash,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
