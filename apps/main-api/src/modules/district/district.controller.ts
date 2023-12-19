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
} from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { PageOptionsDistrictDto } from './dto/find-all-district.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type
import { JwtGuard } from '../auth/guards';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators';

@Controller('districts')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Post()
  @UseGuards(JwtGuard)
  @Roles(UserRole.DEPARTMENT_OFFICER)
  async create(
    @Body() createDistrictDto: CreateDistrictDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const District = await this.districtService.create(createDistrictDto);
      return res.success({
        data: District,
        message: 'District created successfully',
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
  @Roles(UserRole.DEPARTMENT_OFFICER)
  async findAll(
    @Query() pageOptionsDistrictDto: PageOptionsDistrictDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const Districts = await this.districtService.findAll(
        pageOptionsDistrictDto,
      );
      return res.success({ data: Districts });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.DEPARTMENT_OFFICER)
  async findOne(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      const district = await this.districtService.findOne(Number(id));
      return res.success({ data: district });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.DEPARTMENT_OFFICER)
  async update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const updatedDistrict = await this.districtService.update(
        +id,
        updateDistrictDto,
      );
      return res.success({
        data: updatedDistrict,
        message: 'District updated successfully',
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
  @Roles(UserRole.DEPARTMENT_OFFICER)
  async remove(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      await this.districtService.remove(+id);
      return res.success({ message: 'District deleted successfully' });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
