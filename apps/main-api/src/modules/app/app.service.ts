import { Injectable } from '@nestjs/common';
import { uploadFiles, EUploadFolder } from '../../services/files/upload';
import { deleteFiles } from '../../services/files/delete';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async exampleUploadImage(files: Express.Multer.File[]) {
    const result = await uploadFiles(files, EUploadFolder.location);
    // store urls into DB

    return {
      message: 'Successfully upload files',
      urls: result.urls,
    };
  }

  async exampleDeleteImage(fileUrls: string[]) {
    const result = await deleteFiles(fileUrls);

    return result;
  }
}
