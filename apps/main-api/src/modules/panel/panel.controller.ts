import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  Res,
  UploadedFiles,
  ParseFilePipeBuilder,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PanelService } from './panel.service';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { PageOptionsPanelDto } from './dto/find-all-panel.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type
import { FilesInterceptor } from '@nestjs/platform-express';
import { FILE_TYPES_REGEX } from '../../constants/images';
import { JwtGuard } from '../auth/guards';
import { IRequestWithUser } from '../auth/interfaces';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators';

@Controller('panels')
export class PanelController {
  constructor(private readonly panelService: PanelService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 2))
  async create(
    @Body() createPanelDto: CreatePanelDto,
    @Res() res: CustomResponse,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: FILE_TYPES_REGEX,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    images?: Express.Multer.File[],
  ) {
    try {
      const panel = await this.panelService.create(createPanelDto, images);
      return res.success({ data: panel });
    } catch (error) {
      return res.error({
        statusCode: error.status || 500,
        message: error.message,
      });
    }
  }

  @Get()
  @UseGuards(JwtGuard)
  async findAll(
    @Req() req: IRequestWithUser,
    @Query() pageOptionsPanelDto: PageOptionsPanelDto,
  ) {
    try {
      const userId = req.user['sub'];
      return await this.panelService.findAll(pageOptionsPanelDto, userId);
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

  @Get('map')
  async findAllByCrew(@Query() pageOptionsPanelDto: PageOptionsPanelDto) {
    try {
      return await this.panelService.findAllByCrew(pageOptionsPanelDto);
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
  async findOne(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      const panel = await this.panelService.findOne(+id);
      return res.success({ data: panel });
    } catch (error) {
      return res.error({
        statusCode: error.status || 500,
        message: error.message,
      });
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
  @UseInterceptors(FilesInterceptor('images', 2))
  async update(
    @Param('id') id: string,
    @Body() updatePanelDto: UpdatePanelDto,
    @Res() res: CustomResponse,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: FILE_TYPES_REGEX,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    images?: Express.Multer.File[],
  ) {
    try {
      const updatedPanel = await this.panelService.update(
        +id,
        updatePanelDto,
        images,
      );
      return res.success({ data: updatedPanel });
    } catch (error) {
      return res.error({
        statusCode: error.status || 500,
        message: error.message,
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.cdo)
  async remove(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      await this.panelService.remove(+id);
      return res.success({ message: 'Panel deleted successfully' });
    } catch (error) {
      return res.error({
        statusCode: error.status || 500,
        message: error.message,
      });
    }
  }
}
