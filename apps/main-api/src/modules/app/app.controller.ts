import {
  Controller,
  Delete,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('example-upload-files')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 10000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
  ) {
    return this.appService.exampleUploadImage(files);
  }

  @Delete('example-delete-files')
  delete() {
    return this.appService.exampleDeleteImage([
      'https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/location%2F1702145203324-pg-mkt-img-2.jpeg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/location%2F1702145203325-pg-mkt-img-3.jpeg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/location%2F1702145203325-pg-mkt-img-4.jpeg?alt=media',
    ]);
  }
}
