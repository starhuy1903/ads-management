import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignupDto, SigninDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: SignupDto): Promise<Tokens> {
    // Hash the password
    const hash = await this.hashData(dto.password);

    try {
      // Create user in db
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hash,
        },
      });

      return {
        accessToken: await this.genAccessToken(newUser.id, newUser.email),
        refreshToken: await this.genRefreshToken(newUser.id, newUser.email),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: SigninDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // Check if user exists
    if (!user) {
      throw new ForbiddenException('Wrong email or password');
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new ForbiddenException('Wrong email or password');
    }

    return {
      accessToken: await this.genAccessToken(user.id, user.email),
      refreshToken: await this.genRefreshToken(user.id, user.email),
    };
  }

  async logout(userId: number) {
    try {
      const result = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          refreshToken: null,
        },
      });

      if (!result) {
        throw new ForbiddenException('Error logging out');
      }
    } catch (error) {
      throw new ForbiddenException('Error logging out');
    }
  }

  async refresh(userId: number, refreshToken: string): Promise<Tokens> {
    // Find user by id
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Check if user exists
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Check if refresh token matches
    if (refreshToken !== user.refreshToken) {
      throw new ForbiddenException('Invalid refresh token');
    }

    return {
      accessToken: await this.genAccessToken(user.id, user.email),
      refreshToken: await this.genRefreshToken(user.id, user.email),
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // Check if user exists
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Generate reset token
    const resetToken = await this.genToken(
      {
        sub: user.id,
        email: dto.email,
      },
      '10m'
    );
    const redirectLink = `http://localhost:3000/reset-password?token=${resetToken}`; // TODO: Change to frontend url

    // Send email with reset token
    // TODO: Send email

    // Test
    return {
      link: redirectLink,
    };
  }

  async resetPassword(userId: number, dto: ResetPasswordDto) {
    // Hash the password
    const hash = await this.hashData(dto.newPassword);

    // Update password in db
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hash,
        },
      });
    } catch (error) {
      throw new ForbiddenException('Error resetting password');
    }
  }

  // Utility functions
  async hashData(data: string) {
    const saltRounds = 10;
    return await bcrypt.hash(data, saltRounds);
  }

  async genToken(data: any, expireTime: string): Promise<string> {
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(data, {
      expiresIn: expireTime,
      secret,
    });

    return token;
  }

  async genAccessToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_AT_SECRET');
    const expiresIn = this.config.get('JWT_AT_EXPIRES');

    const token = await this.jwt.signAsync(payload, {
      expiresIn,
      secret,
    });

    return token;
  }

  async genRefreshToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_RT_SECRET');
    const expiresIn = this.config.get('JWT_RT_EXPIRES');

    const token = await this.jwt.signAsync(payload, {
      expiresIn,
      secret,
    });

    // Update refresh token in db
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          refreshToken: token,
        },
      });
    } catch (error) {
      throw new ForbiddenException('Error generating refresh token');
    }

    return token;
  }
}
