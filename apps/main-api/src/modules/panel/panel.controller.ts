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
} from '@nestjs/common';
import { PanelService } from './panel.service';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { PageOptionsPanelDto } from './dto/find-all-panel.dto';
import { CustomResponse } from '../../middlewares'; // Import your CustomResponse type
import { FilesInterceptor } from '@nestjs/platform-express';
import { FILE_TYPES_REGEX } from '../../constants/images';

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
        statusCode: 500,
        message: error.message,
      });
    }
  }

  @Get()
  async findAll(
    @Query() pageOptionsPanelDto: PageOptionsPanelDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const panels = await this.panelService.findAll(pageOptionsPanelDto);
      return res.success({ data: panels });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      const panel = await this.panelService.findOne(+id);
      return res.success({ data: panel });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePanelDto: UpdatePanelDto,
    @Res() res: CustomResponse,
  ) {
    try {
      const updatedPanel = await this.panelService.update(+id, updatePanelDto);
      return res.success({ data: updatedPanel });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: CustomResponse) {
    try {
      await this.panelService.remove(+id);
      return res.success({ message: 'Panel deleted successfully' });
    } catch (error) {
      return res.error({
        statusCode: 500,
        message: error.message,
      });
    }
  }
}
