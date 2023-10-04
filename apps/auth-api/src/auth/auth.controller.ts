import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto';
import { IRequestWithUser } from './interfaces';
import { JwtGuard, JwtRefreshGuard, JwtVerifyGuard } from './guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: SignUpDto) {
    return await this.authService.signUp(dto);
  }

  @Post('signin')
  async signIn(@Body() dto: SignInDto) {
    return await this.authService.signIn(dto);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(200)
  async signOut(@Req() req: IRequestWithUser) {
    const tokenId = req.body['tokenId'];
    return await this.authService.logOut(tokenId);
  }

  @UseGuards(JwtVerifyGuard)
  @Post('verify')
  @HttpCode(200)
  async verify(@Req() req: IRequestWithUser) {
    const payload = req.user['payload'];
    return await this.authService.verify(payload);
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
    return await this.authService.forgotPassword(email);
  }

  @UseGuards(JwtVerifyGuard)
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Req() req: IRequestWithUser) {
    const newPassword = req.body['newPassword'];
    const payload = req.user['payload'];
    return await this.authService.resetPassword(payload['sub'], newPassword);
  }
}
