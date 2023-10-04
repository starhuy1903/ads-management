import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResetPasswordDto, SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from './interfaces/ITokenPayload';
import { MailService } from '../mail/mail.service';
import { ScheduleMailReq,SchedulePriority} from '../proto/mail-schedule.pb';

import dayjs from 'dayjs';

import { User } from '@prisma/client';

const getAccessExpiry = () => dayjs().add(5, 's').toDate();
const getRefreshExpiry = () => dayjs().add(1, 'd').toDate();

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async signUp(dto: SignUpDto) {
    // Check if the email is already taken
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (userExists && userExists.verified == true) {
      throw new ForbiddenException('Email already taken');
    }

    // Email is taken but not verified
    if (userExists && userExists.verified == false) {
      // Re-send verification email
      // Generate token
      const { verificationToken } = await this.getJwtVerificationToken(
        userExists.id,
        userExists.email,
      );

      // Generate verification link
      const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`; // Replace with frontend url

      // Send verification email with token
      // TODO: Send email
      
      //send mail
      const templateData = {
        "fullname": userExists.name,
        "link":verificationLink
      }
      const data: ScheduleMailReq = {
        name: 'Send mail verify account',
        priority: SchedulePriority.normal,
        time: new Date().toString(),
        maxRetry: 3,
        mailInfo: {
          toAddresses: [dto.email],
          ccAddresses: [dto.email],
          bccAddresses: [dto.email],
          template: 'account_email_confirm_code',
          templateData: JSON.stringify(templateData),
        },
      };

      await this.mailService.scheduleMail(data).toPromise();

      // Currently returning verification link for testing
      return {
        verificationLink,
      };
    }

    // Hash password
    const password = await argon.hash(dto.password);
    try {
      // Create new user
      const newUser = await this.prismaService.user.create({
        data: {
          email: dto.email,
          password,
          name: dto.name,
        },
      });

      // Generate token
      const { verificationToken } = await this.getJwtVerificationToken(
        newUser.id,
        newUser.email,
      );

      // Generate verification link
      const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`; // Replace with frontend url

      // Send verification email with token
      // TODO: Send email
      const templateData = {
        "fullname": dto.name,
        "link":verificationLink
      }
      const data: ScheduleMailReq = {
        name: 'Send mail verify account',
        priority: SchedulePriority.normal,
        time: new Date().toString(),
        maxRetry: 3,
        mailInfo: {
          toAddresses: [dto.email],
          ccAddresses: [dto.email],
          bccAddresses: [dto.email],
          template: 'account_email_confirm_code',
          templateData: JSON.stringify(templateData),
        },
      };

      await this.mailService.scheduleMail(data).toPromise();
      // Currently returning verification link for testing
      return {
        verificationLink,
      };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw err;
    }
  }

  async verify(payload: ITokenPayload) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (user.verified == true) {
        throw new ForbiddenException('This email is already verified');
      }

      await this.prismaService.user.update({
        where: {
          id: payload.sub,
        },
        data: {
          verified: true,
        },
      });

      return {
        statusCode: 200,
        message: 'Email verified successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  async handeleSignIn(user: User) {
    const { refreshToken } = await this.getJwtRefreshToken(user.id, user.email);
    const { accessToken } = await this.getJwtAccessToken(user.id, user.email);

    try {
      const hash = await argon.hash(refreshToken);
      const token = await this.prismaService.token.create({
        data: {
          expiresAt: getRefreshExpiry(),
          refreshToken: hash,
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
          name: user.name,
        },
      };
    } catch (err) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
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
      throw new ForbiddenException('Credentials incorrect');
    }

    // Check if the user verified his email
    if (user.verified == false) {
      throw new ForbiddenException('Email not verified');
    }

    if (user.password == null) {
      // This email didn't sign in using form
      // Here i send a mail explaining the situation
      throw new ForbiddenException(
        'Credentilas incorrect or this email was gotten from a social account',
      );
    }
    // Compare password
    const isMatch = await argon.verify(user.password, dto.password);

    if (!isMatch) {
      throw new ForbiddenException('Credentilas incorrect');
    }

    return await this.handeleSignIn(user);
  }

  async logOut(tokenId: string) {
    try {
      await this.prismaService.token.delete({
        where: {
          id: tokenId,
        },
      });

      return {
        statusCode: 200,
        message: 'Log out successfully',
      };
    } catch (err) {
      // Token not found -> Already logged out
      if (err.code === 'P2025') {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      // Something went wrong
      throw err;
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
      // TODO:inform the user with the payload sub
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await argon.verify(
      foundToken.refreshToken ?? '',
      refreshToken,
    );

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
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      throw new ForbiddenException('Refresh token expired');
    }
  }

  async forgotPassword(email: string) {
    // Find user
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
        verified: true,
      },
    });

    if (!user) {
      throw new ForbiddenException('Email not found');
    }

    // Set the resetting password flag to true
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        resettingPass: true,
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
    const templateData = {
      "fullname": user.name,
      "link":verificationLink
    }
    const data: ScheduleMailReq = {
      name: 'Send mail verify account',
      priority: SchedulePriority.normal,
      time: new Date().toString(),
      maxRetry: 3,
      mailInfo: {
        toAddresses: [user.email],
        ccAddresses: [user.email],
        bccAddresses: [user.email],
        template: 'change_password_request',
        templateData: JSON.stringify(templateData),
      },
    };
    await this.mailService.scheduleMail(data).toPromise();

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
      throw new ForbiddenException('User not found');
    }

    if (user.resettingPass == false) {
      throw new ForbiddenException('User not resetting password');
    }

    // Hash password
    const hash = await argon.hash(newPassword);

    try {
      // Update user password
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hash,
          resettingPass: false,
        },
      });

      return {
        statusCode: 200,
        message: 'Password reset successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  public async getJwtRefreshToken(sub: number, email: string) {
    const payload: ITokenPayload = { sub, email };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_RT_SECRET'),
      expiresIn: this.config.get('JWT_RT_EXPIRES'),
    });
    return {
      refreshToken,
    };
  }

  async getJwtAccessToken(sub: number, email: string) {
    const payload: ITokenPayload = { sub, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_AT_SECRET'),
      expiresIn: this.config.get('JWT_AT_EXPIRES'),
    });
    return {
      accessToken,
    };
  }

  async getJwtVerificationToken(sub: number, email: string) {
    const payload: ITokenPayload = { sub, email };
    const verificationToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_VT_SECRET'),
      expiresIn: this.config.get('JWT_VT_EXPIRES'),
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
        refreshToken: hash,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      tokenId: tokenId,
      accessTokenExpires: getAccessExpiry(),
      user: {
        id: payload.sub,
        email: payload.email,
      },
    };
  }
}
