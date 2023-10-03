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
import { SignInDto, SignUpDto } from './dto';
import { IRequestWithUser } from './interfaces';
import { JwtGuard, JwtRefreshGuard } from './guard';

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
    const tokenId = req.header('token_id');
    return await this.authService.logOut(tokenId);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: IRequestWithUser) {
    const refreshToken = req.header('authorization').split(' ')[1];
    const tokenId = req.header('token_id');
    const payload = req.user['payload'];

    return await this.authService.refresh(refreshToken, tokenId, payload);
  }
}
