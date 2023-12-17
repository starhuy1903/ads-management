import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LogoutDto,
  ResetPasswordDto,
  SignInDto,
  CreateUserDto,
} from './dto';
import { IRequestWithUser } from './interfaces';
import { JwtGuard, JwtRefreshGuard, JwtVerifyGuard } from './guards';
import { Roles } from './decorators';
import { UserRole } from '@prisma/client';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-user')
  async signUp(@Body() dto: CreateUserDto) {
    return await this.authService.createUser(dto);
  }

  @Post('signin')
  async signIn(@Body() dto: SignInDto) {
    return await this.authService.signIn(dto);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(200)
  async signOut(@Req() req: IRequestWithUser, @Body() dto: LogoutDto) {
    const userId = req.user['sub'];
    return await this.authService.logOut(userId, dto.tokenId);
  }

  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Req() req: IRequestWithUser) {
    const refreshToken = req.user['refreshToken'];
    const tokenId = req.user['tokenId'];
    const payload = req.user['payload'];
    return await this.authService.refresh(refreshToken, tokenId, payload);
  }

  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const email = dto.email;
    await this.authService.forgotPassword(email);
  }

  @UseGuards(JwtVerifyGuard)
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(
    @Req() req: IRequestWithUser,
    @Body() dto: ResetPasswordDto,
  ) {
    const payload = req.user['payload'];
    return await this.authService.resetPassword(
      payload['sub'],
      dto.newPassword,
    );
  }

  @Roles(UserRole.WARD_OFFICER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('test-role')
  async testRoles() {
    return {
      success: true,
      message: 'test roles',
    };
  }
}
