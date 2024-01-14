import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard, RolesGuard } from '../auth/guards';
import { IRequestWithUser } from '../auth/interfaces';
import { CreateUserDto, UpdateUserDto } from '../auth/dto';
import { Roles } from '../auth/decorators';
import { UserRole } from '@prisma/client';
import { PageOptionsUserDto } from './dto/get-user-list.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Req() req: IRequestWithUser) {
    const userId = req.user['sub'];
    return await this.userService.getUserInfo(userId);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateMe(@Req() req: IRequestWithUser, @Body() dto: UpdateUserDto) {
    const userId = req.user['sub'];
    return await this.userService.updateUserInfo(userId, dto);
  }

  // cdo apis
  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.cdo)
  async getUserList(@Query() pageOptionsUserDto: PageOptionsUserDto) {
    return await this.userService.getUserList(pageOptionsUserDto);
  }

  @Get(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.cdo)
  async getUserInfo(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserInfo(id);
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.cdo)
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.cdo)
  async updateUserInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return await this.userService.updateUserInfo(id, dto);
  }
}
