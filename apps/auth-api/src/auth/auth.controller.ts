import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { GetUser } from './decorator';
import { JwtGuard, JwtRefreshGuard, JwtResetGuard } from './guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@GetUser('sub') userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetUser('sub') userId: number,
    @GetUser('refreshToken') refreshToken: string
  ) {
    return this.authService.refresh(userId, refreshToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @UseGuards(JwtResetGuard)
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @GetUser('sub') userId: number,
    @Body() dto: ResetPasswordDto
  ) {
    return this.authService.resetPassword(userId, dto);
  }
}
