import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guards';
import { IRequestWithUser } from '../auth/interfaces';
import { UpdateUserDto } from '../auth/dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getUserInfo(@Req() req: IRequestWithUser) {
    const userId = req.user['sub'];
    return await this.userService.getUserInfo(userId);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateUserInfo(
    @Req() req: IRequestWithUser,
    @Body() dto: UpdateUserDto,
  ) {
    const userId = req.user['sub'];
    return await this.userService.updateUserInfo(userId, dto);
  }
}
