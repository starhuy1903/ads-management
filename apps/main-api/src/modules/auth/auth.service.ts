import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { SignInDto, CreateUserDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from './interfaces/ITokenPayload';

import dayjs from 'dayjs';

import { UserRole, user } from '@prisma/client';
import { SendMailTemplateDto } from '../../services/mail/mail.dto';
import { MailService } from '../../services/mail/mail.service';

const getAccessExpiry = () => dayjs().add(5, 's').toDate();
const getRefreshExpiry = () => dayjs().add(1, 'd').toDate();

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

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
      const token = await this.prismaService.token.create({
        data: {
          expiresAt: getRefreshExpiry(),
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
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          dob: user.dob,
          role: user.role,
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

  async logOut(userId: number, tokenId: string) {
    try {
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

      // Delete token
      await this.prismaService.token.delete({
        where: {
          id: tokenId,
        },
      });

      return {
        message: 'Log out successfully',
      };
    } catch (err) {
      // Token not found -> Already logged out
      if (err.code === 'P2025') {
        throw new UnauthorizedException({
          message: 'Unauthorized',
        });
      }

      // Add logger
      console.log(err);

      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
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
      throw new UnauthorizedException({
        message: 'Unauthorized',
      });
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
      if (payload.sub !== foundToken.userId) {
        // The sub of the token isn't the id of the token in db
        // Log out all session of this payalod id, reFreshToken has been compromised
        await this.prismaService.token.deleteMany({
          where: {
            userId: payload.sub,
          },
        });
        throw new ForbiddenException({
          message: 'Forbidden',
        });
      }

      throw new ForbiddenException({
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
    const verificationLink = `http://localhost:3000/reset-password?token=${verificationToken}`; // Replace with frontend url

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

      return {
        message: 'Forgot password email sent successfully',
      };
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

    return {
      message: 'Reset password successfully',
    };
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

  private async generateTokens(payload: ITokenPayload, tokenId: string) {
    const { accessToken } = await this.getJwtAccessToken(
      payload.sub,
      payload.email,
      payload.role,
    );

    const { refreshToken: newRefreshToken } = await this.getJwtRefreshToken(
      payload.sub,
      payload.email,
      payload.role,
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
