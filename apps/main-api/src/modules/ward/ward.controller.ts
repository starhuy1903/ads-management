import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WardService } from './ward.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { PageOptionsWardDto } from './dto/find-all-ward.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type
import { JwtGuard } from '../auth/guards';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators';

@Controller('wards')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Post()
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
  async create(
    @Body() createWardDto: CreateWardDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const Ward = await this.wardService.create(createWardDto);
      return res.success({
        data: Ward,
        message: 'Ward created successfully',
      });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Get()
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
  @Roles(
    UserRole.cdo,
    UserRole.ward_officer,
    UserRole.district_officer,
  )
  async findAll(@Query() pageOptionsWardDto: PageOptionsWardDto) {
    try {
      if (!pageOptionsWardDto.take || !pageOptionsWardDto.page) {
        return await this.wardService.findAllWithoutPagination();
      }
      return await this.wardService.findAll(pageOptionsWardDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
  async findOne(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      const ward = await this.wardService.findOne(Number(id));
      return res.success({ data: ward });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
  async update(
    @Param('id') id: string,
    @Body() updateWardDto: UpdateWardDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const updatedWard = await this.wardService.update(+id, updateWardDto);
      return res.success({
        data: updatedWard,
        message: 'Ward updated successfully',
      });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
  async remove(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      await this.wardService.remove(+id);
      return res.success({ message: 'Ward deleted successfully' });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
